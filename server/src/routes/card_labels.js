const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/cards/:cardId/labels', async (req, res) => {
  try {
    const { cardId } = req.params;
    const result = await pool.query(
      'SELECT l.* FROM labels l INNER JOIN card_labels cl ON l.id = cl.label_id WHERE cl.card_id = $1 ORDER BY l.id ASC',
      [cardId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/cards/:cardId/labels', async (req, res) => {
  try {
    const { cardId } = req.params;
    const { labelId } = req.body;

    const result = await pool.query(
      'INSERT INTO card_labels (card_id, label_id) VALUES ($1, $2) RETURNING *',
      [cardId, labelId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/cards/:cardId/labels/:labelId', async (req, res) => {
  try {
    const { cardId, labelId } = req.params;

    const result = await pool.query(
      'DELETE FROM card_labels WHERE card_id = $1 AND label_id = $2 RETURNING *',
      [cardId, labelId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Label not assigned to card' });
    }

    res.json({ message: 'Label removed from card successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
