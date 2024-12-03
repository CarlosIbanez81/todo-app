// Testkommentar 

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data.json');


const readData = () => {
  if (fs.existsSync(DATA_FILE)) {
    const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(fileContent);
  }
  return [];
};

const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

app.get('/todos', (req, res) => {
  const todos = readData();
  res.json(todos);
});

app.post('/todos', (req, res) => {
  const todos = readData();
  const newTodo = { id: Date.now(), title: req.body.title, completed: false };
  todos.push(newTodo);
  writeData(todos);
  res.status(201).json(newTodo);
});

app.put('/todos/:id', (req, res) => {
  const todos = readData();
  const id = parseInt(req.params.id);
  const index = todos.findIndex((todo) => todo.id === id);

  if (index !== -1) {
    todos[index] = { ...todos[index], ...req.body };
    writeData(todos);
    res.json(todos[index]);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

app.delete('/todos/:id', (req, res) => {
  const todos = readData();
  const id = parseInt(req.params.id);
  const updatedTodos = todos.filter((todo) => todo.id !== id);

  if (updatedTodos.length !== todos.length) {
    writeData(updatedTodos);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on {PORT}`);
});
