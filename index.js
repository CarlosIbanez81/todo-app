// Testkommentar check
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());

const DATA_FILE = process.env.FILE_PATH
const PORT= process.env.PORT

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
  try{ 
    if (!fs.existsSync(DATA_FILE)) {
      throw new Error('I cant see');
    }
  const todos = readData();
  res.json(todos);
} catch (error){
  res.status(500).json ({error: 'Error:404 Failed to find datafile', details: error.message});
}
});



app.post('/todos', (req, res) => {
  try { 
    let todos=[];
    if (fs.existsSync(DATA_FILE)) {
      todos=readData();
    }
  
  const newTodo = { id: Date.now(), title: req.body.title, completed: false };
  todos.push(newTodo);
  writeData(todos);
  res.status(201).json(newTodo);
  } catch(error) {
    res.status(500).json({error: 'Failed to create file', details: error.message});
  }
    
});

app.put('/todos/:id', (req, res) => {
  try {
    const todos = readData();
    const id = parseInt(req.params.id);
    const index = todos.findIndex((todo) => todo.id === id); 
    if (index !== -1) {
      
      todos[index] = { ...todos[index], ...req.body };
      writeData(todos);
      res.status(200).json(todos[index]); 
    } else {
      res.status(404).json({ error: 'Todo ID not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error 400: Failed to update task', details: error.message });
  }
});


app.delete('/todos/:id', (req, res) => {
  try {3
    const todos = readData();
    const id = parseInt(req.params.id);


    const todoToDelete = todos.find((todo) => todo.id === id);

    if (!todoToDelete) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const updatedTodos = todos.filter((todo) => todo.id !== id);

    writeData(updatedTodos);
    res.status(204).send(); 
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task', details: error.message });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});