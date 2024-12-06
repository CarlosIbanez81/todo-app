document.getElementById('getTodosBtn').addEventListener('click', fetchTodos);

document.getElementById('addTodoBtn').addEventListener('click', () => {
  const title = document.getElementById('todoTitle').value;
  if (title) {
    fetch('http://localhost:3000/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    })
    .then(response => response.json())
    .then(newTodo => {
      const todoElement = document.createElement('div');
      todoElement.textContent = `${newTodo.title} - Not Completed`;
      document.getElementById('todoList').appendChild(todoElement);
    })
    .catch(error => {
      console.error('Error adding todo:', error);
    });
  } else {
    alert('Please enter a title for the todo');
  }
});

document.getElementById('updateTodoBtn').addEventListener('click', () => {
  const todoId = document.getElementById('todoId').value;
  const completed = document.getElementById('todoCompleted').checked;

  if (todoId) {
    fetch(`http://localhost:3000/todos/${todoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    })
    .then(response => {
      if (!response.ok) {
        console.error('Error updating todo:', response.statusText);
      }
      return response.json();
    })
    .then(updatedTodo => {
      console.log('Updated Todo:', updatedTodo);
      document.getElementById('todoList').innerHTML = '';
      fetchTodos();
    })
    .catch(error => {
      console.error('Error updating todo:', error);
    });
  } else {
    alert('Please provide a valid Todo ID');
  }
});

document.getElementById('deleteTodoBtn').addEventListener('click', () => {
  const todoId = document.getElementById('todoId').value;

  if (todoId) {
    fetch(`http://localhost:3000/todos/${todoId}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        document.getElementById('todoList').innerHTML = '';
        fetchTodos();
      } else {
        console.error('Failed to delete the todo:', response.statusText);
      }
    })
    .catch(error => {
      console.error('Error deleting todo:', error);
    });
  } else {
    alert('Please provide a valid Todo ID');
  }
});

function fetchTodos() {
  fetch('http://localhost:3000/todos')
    .then(response => response.json())
    .then(todos => {
      const todosContainer = document.getElementById('todoList');
      todosContainer.innerHTML = '';

      todos.forEach(todo => {
        const todoElement = document.createElement('div');
        todoElement.textContent = `${todo.title} - ${todo.completed ? 'Completed' : 'Not Completed'} - ID: ${todo._id}`;

        todosContainer.appendChild(todoElement);
      });
    })
    .catch(error => {
      console.error('Error fetching todos:', error);
    });
}
