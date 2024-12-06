const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/todo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connect('mongodb://localhost:27017/secrettodo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const dbTodo = mongoose.connection.useDb('todo');
const dbSecretTodo = mongoose.connection.useDb('secrettodo');

const TodoSchema = new mongoose.Schema({
  title: String,
  completed: Boolean
});

const Todo = dbTodo.model('Todo', TodoSchema);
const SecretTodo = dbSecretTodo.model('Todo', TodoSchema);

const PASSWORD = 'secret';

app.use(bodyParser.json());

function authenticate(req, res, next) {
  const password = req.headers['x-password'];
  if (password === PASSWORD) {
    next();
  } else {
    return res.status(403).json({ error: 'Unauthorized access to secret database' });
  }
}

app.get('/:database/todos', async (req, res) => {
  const { database } = req.params;
  try {
    const model = database === 'secrettodo' ? SecretTodo : Todo;
    const todos = await model.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

app.post('/:database/todos', async (req, res) => {
  const { database } = req.params;
  const { title } = req.body;

  try {
    const model = database === 'secrettodo' ? SecretTodo : Todo;
    const newTodo = new model({ title, completed: false });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add todo' });
  }
});

app.put('/:database/todos/:id', async (req, res) => {
  const { database, id } = req.params;
  const { completed } = req.body;

  try {
    const model = database === 'secrettodo' ? SecretTodo : Todo;
    const updatedTodo = await model.findByIdAndUpdate(id, { completed }, { new: true });
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

app.delete('/:database/todos/:id', async (req, res) => {
  const { database, id } = req.params;

  try {
    const model = database === 'secrettodo' ? SecretTodo : Todo;
    await model.findByIdAndDelete(id);
    res.status(200).json({ message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
