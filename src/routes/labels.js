const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/boards/:boardId/labels', async (req, res) => {
  try {
    const { boardId } = req.params;
    const result = await pool.query('SELECT * FROM labels WHERE board_id = $1 ORDER BY id ASC', [
      boardId,
    ]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/boards/:boardId/labels', async (req, res) => {
  try {
    const { boardId } = req.params;
    const { name, color } = req.body;

    const result = await pool.query(
      'INSERT INTO labels (board_id, name, color) VALUES ($1, $2, $3) RETURNING *',
      [boardId, name, color]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.patch('/boards/:boardId/labels/:labelId', async (req, res) => {
  try {
    const { boardId, labelId } = req.params;
    const { name, color } = req.body;

    const result = await pool.query(
      'UPDATE labels SET name = COALESCE($1, name), color = COALESCE($2, color) WHERE board_id = $3 AND id = $4 RETURNING *',
      [name, color, boardId, labelId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Label not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/boards/:boardId/labels/:labelId', async (req, res) => {
  try {
    const { boardId, labelId } = req.params;

    const result = await pool.query(
      'DELETE FROM labels WHERE board_id = $1 AND id = $2 RETURNING *',
      [boardId, labelId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Label not found' });
    }

    res.json({ message: 'Label deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
