const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/cards/:cardId/comments', async (req, res) => {
  try {
    const { cardId } = req.params;
    const result = await pool.query('SELECT * FROM comments WHERE card_id = $1 ORDER BY id ASC', [
      cardId,
    ]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/cards/:cardId/comments', async (req, res) => {
  try {
    const { cardId } = req.params;
    const { content } = req.body;

    const result = await pool.query(
      'INSERT INTO comments (card_id, content) VALUES ($1, $2) RETURNING *',
      [cardId, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.patch('/cards/:cardId/comments/:commentId', async (req, res) => {
  try {
    const { cardId, commentId } = req.params;
    const { content } = req.body;

    const result = await pool.query(
      'UPDATE comments SET content = COALESCE($1, content) WHERE card_id = $2 AND id = $3 RETURNING *',
      [content, cardId, commentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/cards/:cardId/comments/:commentId', async (req, res) => {
  try {
    const { cardId, commentId } = req.params;

    const result = await pool.query(
      'DELETE FROM comments WHERE card_id = $1 AND id = $2 RETURNING *',
      [cardId, commentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
