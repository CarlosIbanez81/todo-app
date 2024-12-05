document.addEventListener('DOMContentLoaded', () => {
    // Get references to the UI elements
    const getTodosBtn = document.getElementById('getTodosBtn');
    const todosContainer = document.getElementById('todosContainer'); // Element to display todos
  
    // Fetch and display todos when the "Get Todos" button is clicked
    getTodosBtn.addEventListener('click', () => {
      fetch('http://localhost:3000/todos')  // Adjust the URL based on your backend
        .then(response => response.json())
        .then(todos => {
          // Clear the container before displaying new todos
          todosContainer.innerHTML = '';
  
          // Loop through each todo and add it to the container
          todos.forEach(todo => {
            const todoElement = document.createElement('div');
            todoElement.textContent = `${todo.title} - ${todo.completed ? 'Completed' : 'Not Completed'}`;
            todosContainer.appendChild(todoElement);
          });
        })
        .catch(error => {
          console.error('Error fetching todos:', error);
        });
    });
  });
  