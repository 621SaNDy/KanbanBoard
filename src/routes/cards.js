const express = require('express');
const pool = require('../db');

const router = express.Router();

const buildCardPositionUpdateQuery = (cards) => {
  const values = [];
  const placeholders = cards.map((card, index) => {
    values.push(card.id, card.columnId, card.position);
    const baseIndex = index * 3;
    return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3})`;
  });

  return {
    text:
      `UPDATE cards AS c
       SET column_id = v.column_id,
           position = v.position
       FROM (VALUES ${placeholders.join(', ')}) AS v(id, column_id, position)
       WHERE c.id = v.id`,
    values,
  };
};

router.get('/columns/:columnId/cards', async (req, res) => {
  try {
    const { columnId } = req.params;
    const result = await pool.query('SELECT * FROM cards WHERE column_id = $1 ORDER BY position ASC', [
      columnId,
    ]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/columns/:columnId/cards', async (req, res) => {
  try {
    const { columnId } = req.params;
    const { title, description, dueDate, due_date } = req.body;

    const positionResult = await pool.query(
      'SELECT COALESCE(MAX(position), 0) + 1 AS next_position FROM cards WHERE column_id = $1',
      [columnId]
    );

    const nextPosition = positionResult.rows[0].next_position;
    const result = await pool.query(
      'INSERT INTO cards (column_id, title, description, due_date, position) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [columnId, title, description, dueDate ?? due_date ?? null, nextPosition]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/cards/:cardId', async (req, res) => {
  try {
    const { cardId } = req.params;
    const result = await pool.query('SELECT * FROM cards WHERE id = $1', [cardId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.patch('/cards/:cardId', async (req, res) => {
  try {
    const { cardId } = req.params;
    const { title, description, dueDate, due_date, position } = req.body;

    const result = await pool.query(
      'UPDATE cards SET title = COALESCE($1, title), description = COALESCE($2, description), due_date = COALESCE($3, due_date), position = COALESCE($4, position) WHERE id = $5 RETURNING *',
      [title, description, dueDate ?? due_date ?? null, position, cardId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/cards/:cardId', async (req, res) => {
  try {
    const { cardId } = req.params;
    const result = await pool.query('DELETE FROM cards WHERE id = $1 RETURNING *', [cardId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }

    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.patch('/cards/:cardId/move', async (req, res) => {
  const client = await pool.connect();

  try {
    const { cardId } = req.params;
    const { columnId, position } = req.body;

    await client.query('BEGIN');

    const cardResult = await client.query('SELECT * FROM cards WHERE id = $1 FOR UPDATE', [cardId]);
    if (cardResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Card not found' });
    }

    const currentCard = cardResult.rows[0];
    const targetColumnId = Number(columnId);
    const targetPositionInput = Number(position);
    const sourceColumnId = currentCard.column_id;
    const sourcePosition = currentCard.position;

    const currentColumnCardsResult = await client.query(
      'SELECT id FROM cards WHERE column_id = $1 AND id <> $2 ORDER BY position ASC',
      [sourceColumnId, cardId]
    );

    const targetColumnCardsResult =
      sourceColumnId === targetColumnId
        ? currentColumnCardsResult
        : await client.query('SELECT id FROM cards WHERE column_id = $1 ORDER BY position ASC', [
            targetColumnId,
          ]);

    const sourceColumnCards = currentColumnCardsResult.rows.map((row) => ({
      id: row.id,
      columnId: sourceColumnId,
    }));

    if (sourceColumnId === targetColumnId) {
      const targetPosition = Math.max(1, Math.min(targetPositionInput, sourceColumnCards.length + 1));
      const reorderedCards = [...sourceColumnCards];
      const sourceIndex = reorderedCards.findIndex((card) => card.id === currentCard.id);

      if (sourceIndex !== -1) {
        reorderedCards.splice(sourceIndex, 1);
      }

      reorderedCards.splice(targetPosition - 1, 0, {
        id: currentCard.id,
        columnId: targetColumnId,
      });

      const updates = reorderedCards.map((card, index) => ({
        id: card.id,
        columnId: card.columnId,
        position: index + 1,
      }));

      const updateQuery = buildCardPositionUpdateQuery(updates);
      await client.query(updateQuery.text, updateQuery.values);
    } else {
      const targetPosition = Math.max(1, Math.min(targetPositionInput, targetColumnCardsResult.rows.length + 1));

      const sourceUpdates = sourceColumnCards.map((card, index) => ({
        id: card.id,
        columnId: sourceColumnId,
        position: index + 1,
      }));

      const targetCards = targetColumnCardsResult.rows.map((row) => ({
        id: row.id,
        columnId: targetColumnId,
      }));

      targetCards.splice(targetPosition - 1, 0, {
        id: currentCard.id,
        columnId: targetColumnId,
      });

      const targetUpdates = targetCards.map((card, index) => ({
        id: card.id,
        columnId: card.columnId,
        position: index + 1,
      }));

      if (sourceUpdates.length > 0) {
        const sourceUpdateQuery = buildCardPositionUpdateQuery(sourceUpdates);
        await client.query(sourceUpdateQuery.text, sourceUpdateQuery.values);
      }

      const targetUpdateQuery = buildCardPositionUpdateQuery(targetUpdates);
      await client.query(targetUpdateQuery.text, targetUpdateQuery.values);
    }

    const updatedCardResult = await client.query('SELECT * FROM cards WHERE id = $1', [cardId]);

    await client.query('COMMIT');
    res.json(updatedCardResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
});

module.exports = router;