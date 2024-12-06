document.addEventListener('DOMContentLoaded', () => {
  const getTodosBtn = document.getElementById('getTodosBtn');
  const addTodoBtn = document.getElementById('addTodoBtn');
  const updateTodoBtn = document.getElementById('updateTodoBtn');
  const deleteTodoBtn = document.getElementById('deleteTodoBtn');
  const todoTitle = document.getElementById('todoTitle');
  const todoId = document.getElementById('todoId');
  const todoCompleted = document.getElementById('todoCompleted');
  const todoList = document.getElementById('todoList');

  // Elements for authentication and secret data
  const authButton = document.getElementById('auth-button');
  const fetchSecretButton = document.getElementById('fetch-secret');
  const secretSection = document.getElementById('secret-section');
  const secretDataParagraph = document.getElementById('secret-data');
  const passwordInput = document.getElementById('password');

  getTodosBtn.addEventListener('click', () => {
      fetch('http://localhost:3000/todos')
          .then(response => response.json())
          .then(todos => {
              todoList.innerHTML = '';
              todos.forEach(todo => {
                  const todoDiv = document.createElement('div');
                  todoDiv.classList.add('todo-item');
                  todoDiv.dataset.id = todo._id;
                  todoDiv.innerHTML = `
                      <span>${todo.title} - ${todo.completed ? 'Completed' : 'Not Completed'}</span>
                      <span class="todo-id">ID: ${todo._id}</span>
                  `;
                  todoList.appendChild(todoDiv);
              });
          })
          .catch(error => console.error('Error fetching todos:', error));
  });

  addTodoBtn.addEventListener('click', () => {
      const title = todoTitle.value.trim();
      if (title) {
          fetch('http://localhost:3000/todos', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ title })
          })
              .then(response => response.json())
              .then(newTodo => {
                  const todoDiv = document.createElement('div');
                  todoDiv.classList.add('todo-item');
                  todoDiv.dataset.id = newTodo._id;
                  todoDiv.innerHTML = `
                      <span>${newTodo.title} - ${newTodo.completed ? 'Completed' : 'Not Completed'}</span>
                      <span class="todo-id">ID: ${newTodo._id}</span>
                  `;
                  todoList.appendChild(todoDiv);
                  todoTitle.value = ''; // Clear the input field after adding the todo
              })
              .catch(error => console.error('Error adding todo:', error));
      }
  });

  updateTodoBtn.addEventListener('click', () => {
      const id = todoId.value.trim();
      const completed = todoCompleted.checked;
      if (id) {
          fetch(`http://localhost:3000/todos/${id}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ completed })
          })
              .then(response => response.json())
              .then(updatedTodo => {
                  const todoDiv = document.querySelector(`#todoList .todo-item[data-id="${id}"]`);
                  if (todoDiv) {
                      todoDiv.querySelector('span').textContent = `${updatedTodo.title} - ${updatedTodo.completed ? 'Completed' : 'Not Completed'}`;
                  }
              })
              .catch(error => console.error('Error updating todo:', error));
      }
  });

  deleteTodoBtn.addEventListener('click', () => {
      const id = todoId.value.trim();
      if (id) {
          fetch(`http://localhost:3000/todos/${id}`, {
              method: 'DELETE'
          })
              .then(() => {
                  const todoDiv = document.querySelector(`#todoList .todo-item[data-id="${id}"]`);
                  if (todoDiv) {
                      todoList.removeChild(todoDiv);
                  }
              })
              .catch(error => console.error('Error deleting todo:', error));
      }
  });

  authButton.addEventListener('click', async () => {

    const password = passwordInput.value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        const data = await response.json();

        if (response.ok) {
            secretSection.style.display = "block";
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Authentication Error:', error);
    }
});

  // Fetch secret data from server
  fetchSecretButton.addEventListener('click', async () => {
      try {
          const response = await fetch('http://localhost:3000/get-secret-data', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ password: passwordInput.value })
          });

          if (!response.ok) throw new Error('Failed to fetch secret data');

          const data = await response.json();
          secretDataParagraph.textContent = data.message;
      } catch (error) {
          secretDataParagraph.textContent = "Error fetching data!";
          console.error(error);
      }
  });
});
