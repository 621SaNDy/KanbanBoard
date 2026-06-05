const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/boards', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM boards ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/boards', async (req, res) => {
  try {
    const { name } = req.body;
    const result = await pool.query(
      'INSERT INTO boards (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {    
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/boards/:boardId', async (req, res) => {
  try {
    const boardId = req.params.boardId;

    const boardResult = await pool.query('SELECT * FROM boards WHERE id = $1', [boardId]);
    if (boardResult.rows.length === 0) {
      return res.status(404).json({ error: 'Board not found' });
    }

    const columnsResult = await pool.query(
      'SELECT * FROM "columns" WHERE board_id = $1 ORDER BY position ASC',
      [boardId]
    );

    const board = boardResult.rows[0];
    const columns = [];

    for (const column of columnsResult.rows) {
      const cardsResult = await pool.query(
        'SELECT * FROM cards WHERE column_id = $1 ORDER BY position ASC',
        [column.id]
      );

      columns.push({
        ...column,
        cards: cardsResult.rows,
      });
    }

    res.json({
      ...board,
      columns,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.patch('/boards/:boardId', async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const { name } = req.body;

    const result = await pool.query(
      'UPDATE boards SET name = $1 WHERE id = $2 RETURNING *',
      [name, boardId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Board not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/boards/:boardId', async (req, res) => {
  try {
    const boardId = req.params.boardId;

    const result = await pool.query('DELETE FROM boards WHERE id = $1 RETURNING *', [boardId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Board not found' });
    }

    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
