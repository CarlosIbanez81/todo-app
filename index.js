require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Todo = require('./models/todo');
const connectDB = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

const PORT = process.env.PORT || 3000;

app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching todos', details: error.message });
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
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo', details: error.message });
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
