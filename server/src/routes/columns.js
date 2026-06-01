const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/boards/:boardId/columns', async (req, res) => {
  try {
    const { boardId } = req.params;
    const result = await pool.query(
      'SELECT * FROM "columns" WHERE board_id = $1 ORDER BY position ASC',
      [boardId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/boards/:boardId/columns', async (req, res) => {
  try {
    const { boardId } = req.params;
    const { name } = req.body;

    const countResult = await pool.query(
      'SELECT COUNT(*) as count FROM "columns" WHERE board_id = $1',
      [boardId]
    );

    const count = countResult.rows[0].count;
    const nextPosition = (count + 1) * 100;
    const result = await pool.query(
      'INSERT INTO "columns" (board_id, name, position) VALUES ($1, $2, $3) RETURNING *',
      [boardId, name, nextPosition]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.patch('/columns/:columnId', async (req, res) => {
  try {
    const { columnId } = req.params;
    const { name, position } = req.body;

    const result = await pool.query(
      'UPDATE "columns" SET name = COALESCE($1, name), position = COALESCE($2, position) WHERE id = $3 RETURNING *',
      [name, position, columnId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Column not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/columns/:columnId', async (req, res) => {
  try {
    const { columnId } = req.params;
    const result = await pool.query('DELETE FROM "columns" WHERE id = $1 RETURNING *', [columnId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Column not found' });
    }

    res.json({ message: 'Column deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.patch('/boards/:boardId/columns/reorder', async (req, res) => {
  const client = await pool.connect();

  try {
    const { boardId } = req.params;
    const { order } = req.body;

    await client.query('BEGIN');

    for (let index = 0; index < order.length; index += 1) {
      await client.query('UPDATE "columns" SET position = $1 WHERE id = $2 AND board_id = $3', [
        (index + 1) * 100,
        order[index],
        boardId,
      ]);
    }

    const result = await client.query(
      'SELECT * FROM "columns" WHERE board_id = $1 ORDER BY position ASC',
      [boardId]
    );

    await client.query('COMMIT');
    res.json(result.rows);
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
});

module.exports = router;
