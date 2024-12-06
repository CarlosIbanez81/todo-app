require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Todo = require('./models/todo');
const connectDB = require('./db');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const SECRET_PASSWORD = process.env.SECRET_PASSWORD;
console.log('Backend secret password:', SECRET_PASSWORD);

app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos', details: error.message });
  }
});

app.post('/todos', async (req, res) => {
  try {
    const newTodo = new Todo({
      title: req.body.title,
      completed: false,
    });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo', details: error.message });
  }
});

app.put('/todos/:id', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, { completed: req.body.completed }, { new: true });
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo', details: error.message });
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo', details: error.message });
  }
});

app.post('/authenticate', (req, res) => {
  const { password } = req.body;

  if (password === SECRET_PASSWORD) {
    res.status(200).json({ message: 'Authentication successful' });
  } else {
    res.status(401).json({ message: 'Incorrect password' });
  }
});

app.get('/secret-data', (req, res) => {
  if (req.headers.authorization === SECRET_PASSWORD) {
    res.status(200).json({ secret: 'This is confidential data!' });
  } else {
    res.status(403).json({ message: 'Unauthorized access' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
