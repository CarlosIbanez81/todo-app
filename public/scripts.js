document.addEventListener('DOMContentLoaded', () => {
  // Get Todos Button
  document.getElementById('getTodosBtn').addEventListener('click', getTodos);

  // Add Todo Form
  document.getElementById('addTodoForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.querySelector('input[name="title"]').value;
    addTodo(title);
  });

  // Update Todo Form
  document.getElementById('updateTodoForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const id = document.querySelector('input[name="updateId"]').value;
    const title = document.querySelector('input[name="updateTitle"]').value;
    const completed = document.querySelector('input[name="updateCompleted"]').checked;
    updateTodo(id, title, completed);
  });

  // Delete Todo Form
  document.getElementById('deleteTodoForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const id = document.querySelector('input[name="deleteId"]').value;
    deleteTodo(id);
  });
});

// Fetch all todos
async function getTodos() {
  try {
    const response = await fetch('http://localhost:3000/todos');
    if (!response.ok) throw new Error('Failed to fetch todos');
    const todos = await response.json();
    console.log(todos); // Replace with your UI rendering logic
    alert(JSON.stringify(todos, null, 2));
  } catch (error) {
    console.error(error);
    alert('Error fetching todos: ' + error.message);
  }
}

// Add a new todo
async function addTodo(title) {
  try {
    const response = await fetch('http://localhost:3000/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!response.ok) throw new Error('Failed to add todo');
    const newTodo = await response.json();
    console.log(newTodo);
    alert('Todo added: ' + JSON.stringify(newTodo));
  } catch (error) {
    console.error(error);
    alert('Error adding todo: ' + error.message);
  }
}

// Update a todo
async function updateTodo(id, title, completed) {
  try {
    const response = await fetch(`http://localhost:3000/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, completed }),
    });
    if (!response.ok) throw new Error('Failed to update todo');
    const updatedTodo = await response.json();
    console.log(updatedTodo);
    alert('Todo updated: ' + JSON.stringify(updatedTodo));
  } catch (error) {
    console.error(error);
    alert('Error updating todo: ' + error.message);
  }
}

// Delete a todo
async function deleteTodo(id) {
  try {
    const response = await fetch(`http://localhost:3000/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete todo');
    alert('Todo deleted');
  } catch (error) {
    console.error(error);
    alert('Error deleting todo: ' + error.message);
  }
}
