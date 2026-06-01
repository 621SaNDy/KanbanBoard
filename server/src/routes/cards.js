const express = require('express');
const pool = require('../db');

const router = express.Router();

const resequenceColumn = async (client, columnId, cardIds) => {
  if (cardIds.length === 0) {
    return;
  }

  await client.query('UPDATE cards SET position = position + 1000000 WHERE column_id = $1', [
    columnId,
  ]);

  for (let index = 0; index < cardIds.length; index += 1) {
    await client.query('UPDATE cards SET position = $1 WHERE id = $2 AND column_id = $3', [
      index + 1,
      cardIds[index],
      columnId,
    ]);
  }
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
    const targetPositionInput = Number.isFinite(Number(position)) ? Number(position) : 1;
    const sourceColumnId = currentCard.column_id;

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

    if (sourceColumnId === targetColumnId) {
      const targetPosition = Math.max(1, Math.min(targetPositionInput, currentColumnCardsResult.rows.length + 1));
      const reorderedCards = currentColumnCardsResult.rows.map((row) => row.id);
      reorderedCards.splice(targetPosition - 1, 0, currentCard.id);

      await resequenceColumn(client, sourceColumnId, reorderedCards);
    } else {
      const targetPosition = Math.max(1, Math.min(targetPositionInput, targetColumnCardsResult.rows.length + 1));

      const sourceCardIds = currentColumnCardsResult.rows.map((row) => row.id);
      const targetCardIds = targetColumnCardsResult.rows.map((row) => row.id);

      targetCardIds.splice(targetPosition - 1, 0, currentCard.id);

      await client.query('UPDATE cards SET column_id = $1, position = 0 WHERE id = $2', [
        targetColumnId,
        currentCard.id,
      ]);

      await client.query('UPDATE cards SET position = position + 1000000 WHERE column_id IN ($1, $2)', [
        sourceColumnId,
        targetColumnId,
      ]);

      await resequenceColumn(client, sourceColumnId, sourceCardIds);
      await resequenceColumn(client, targetColumnId, targetCardIds);
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