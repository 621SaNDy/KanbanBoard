const express = require('express');
const cors = require('cors');
require('dotenv').config();

const boardsRouter = require('./src/routes/boards');
const columnsRouter = require('./src/routes/columns');
const cardsRouter = require('./src/routes/cards');
const labelsRouter = require('./src/routes/labels');
const commentsRouter = require('./src/routes/comments');
const cardLabelsRouter = require('./src/routes/card_labels');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/', boardsRouter);
app.use('/', columnsRouter);
app.use('/', cardsRouter);
app.use('/', labelsRouter);
app.use('/', commentsRouter);
app.use('/', cardLabelsRouter);

app.get('/', (req, res) => {
  res.json({ message: 'KanbanBoard API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
