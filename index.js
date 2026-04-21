const express = require('express');
const cors = require('cors');
require('dotenv').config();
const boardsRouter = require('./src/routes/boards');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/', boardsRouter);

app.get('/', (req, res) => {
  res.json({ message: 'KanbanBoard API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
