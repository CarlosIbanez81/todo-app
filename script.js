document.addEventListener('DOMContentLoaded', () => {
  const getTodosBtn = document.getElementById('getTodosBtn');
  const todoListDiv = document.getElementById('todoList');
  const addTodoForm = document.getElementById('addTodoForm');
  const updateTodoForm = document.getElementById('updateTodoForm');
  const deleteTodoForm = document.getElementById('deleteTodoForm');

  // Fetch and display todos
  getTodosBtn.addEventListener('click', () => {
      fetch('http://localhost:3000/todos')
          .then(response => response.json())
          .then(todos => {
              todoListDiv.innerHTML = ''; // Clear the current list
              todos.forEach(todo => {
                  const todoItem = document.createElement('div');
                  todoItem.innerText = `${todo.id}: ${todo.title}`;
                  todoListDiv.appendChild(todoItem);
              });
          })
          .catch(error => console.error('Error fetching todos:', error));
  });

  // Add a new todo
  addTodoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = e.target.title.value;
      fetch('http://localhost:3000/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title })
      })
          .then(response => response.json())
          .then(newTodo => {
              alert('Todo added: ' + JSON.stringify(newTodo));
              e.target.reset();
          })
          .catch(error => console.error('Error adding todo:', error));
  });

  // Update a todo
  updateTodoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = e.target.updateId.value;
      const title = e.target.updateTitle.value;
      const completed = e.target.updateCompleted.checked;
      fetch(`http://localhost:3000/todos/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, completed })
      })
          .then(response => {
              if (response.ok) {
                  alert('Todo updated successfully');
              } else {
                  alert('Failed to update todo');
              }
          })
          .catch(error => console.error('Error updating todo:', error));
  });

  // Delete a todo
  deleteTodoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = e.target.deleteId.value;
      fetch(`http://localhost:3000/todos/${id}`, { method: 'DELETE' })
          .then(response => {
              if (response.ok) {
                  alert('Todo deleted successfully');
              } else {
                  alert('Failed to delete todo');
              }
          })
          .catch(error => console.error('Error deleting todo:', error));
  });
});
 