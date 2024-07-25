const users = [
  { username: 'Neha', password: 'NUBFF', tasks: [] },
  { username: 'Uma', password: '14122004', tasks: [] },
  { username: 'Nishanth', password: 'password', tasks: [] },
  { username: 'Trilok', password: 'password2', tasks: [] }
];

let currentUser = null;

function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
      currentUser = user;
      document.getElementById('login-container').style.display = 'none';
      document.getElementById('register-container').style.display = 'none';
      document.getElementById('task-form').style.display = 'block';
      displayTasks();
  } else {
      alert('Invalid username or password');
  }
}

function logout() {

  
  // Redirect to index.html
  window.location.href = "index.html";
}


function register() {
  const newUsername = document.getElementById('new-username').value.trim();
  const newPassword = document.getElementById('new-password').value.trim();
  
  if (newUsername !== '' && newPassword !== '') {
    if (users.find(u => u.username === newUsername)) {
      alert('Username already exists. Please choose a different one.');
    } else {
      users.push({ username: newUsername, password: newPassword, tasks: [] });
      alert('Registration successful! You can now login with your new credentials.');
      document.getElementById('register-container').style.display = 'none';
      document.getElementById('login-container').style.display = 'block';
    }
  } else {
    alert('Please enter a valid username and password.');
  }
}

function addTask() {
  if (!currentUser) {
      alert('Please login first');
      return;
  }
  const taskInput = document.getElementById('task-input');
  const taskText = taskInput.value.trim();
  const taskDatetime = document.getElementById('task-datetime').value;

  if (taskText !== '' && taskDatetime !== '') {
      const taskList = currentUser.tasks;
      const priority = document.getElementById('priority').value;
      const category = document.getElementById('category').value;
      const newTask = { text: taskText, datetime: taskDatetime, priority, category };
      taskList.push(newTask);
      saveTasks();
      displayTasks();
      taskInput.value = '';
      document.getElementById('task-datetime').value = '';
      alert('Task added successfully');
  } else {
      alert('Please enter a task and select date and time');
  }
}

function deleteTask(index) {
  currentUser.tasks.splice(index, 1);
  saveTasks();
  displayTasks();
}

function displayTasks() {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';
  currentUser.tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
          <span>${task.text} (${task.priority}, ${task.category})</span>
          <span>${task.datetime}</span>
          <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
      `;
      taskList.appendChild(li);
  });
}

function saveTasks() {
  localStorage.setItem(currentUser.username, JSON.stringify(currentUser.tasks));
}

function clearTaskList() {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';
}

window.onload = function() {
  users.forEach(user => {
      const savedTasks = localStorage.getItem(user.username);
      if (savedTasks) {
          user.tasks = JSON.parse(savedTasks);
      }
  });
  displayTasks(); // Display tasks on page load
};

function checkTaskTime() {
  const now = new Date();
  users.forEach(user => {
      user.tasks.forEach(task => {
          const taskTime = new Date(task.datetime);
          if (now.getTime() === taskTime.getTime()) {
              alert(`It's time for the task: ${task.text}`);
          }
      });
  });
}

setInterval(checkTaskTime, 1000);
