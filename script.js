// StudyMate: a beginner-friendly task planner using plain JavaScript.

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const subjectInput = document.getElementById('subjectInput');
const priorityInput = document.getElementById('priorityInput');
const taskList = document.getElementById('taskList');
const emptyMessage = document.getElementById('emptyMessage');

let tasks = JSON.parse(localStorage.getItem('studyMateTasks')) || [];
let currentFilter = 'all';

// Show today's date in the welcome section.
const today = new Date();
document.getElementById('dayName').textContent =
  today.toLocaleDateString('en-IN', { weekday: 'long' });
document.getElementById('currentDate').textContent =
  today.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

// Save tasks so they are still available after refreshing the page.
function saveTasks() {
  localStorage.setItem('studyMateTasks', JSON.stringify(tasks));
}

// Add a new task when the form is submitted.
taskForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const title = taskInput.value.trim();
  if (title === '') return;

  const newTask = {
    id: Date.now(),
    title: title,
    subject: subjectInput.value,
    priority: priorityInput.value,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  taskForm.reset();
  taskInput.focus();
});

// Change the completed status of a task.
function toggleTask(taskId) {
  tasks = tasks.map(function (task) {
    if (task.id === taskId) {
      task.completed = !task.completed;
    }
    return task;
  });
  saveTasks();
  renderTasks();
}

// Remove a task from the list.
function deleteTask(taskId) {
  tasks = tasks.filter(function (task) {
    return task.id !== taskId;
  });
  saveTasks();
  renderTasks();
}

// Display tasks based on the selected filter.
function renderTasks() {
  taskList.innerHTML = '';

  let visibleTasks = tasks;
  if (currentFilter === 'pending') {
    visibleTasks = tasks.filter(task => !task.completed);
  } else if (currentFilter === 'completed') {
    visibleTasks = tasks.filter(task => task.completed);
  }

  visibleTasks.forEach(function (task) {
    const listItem = document.createElement('li');
    listItem.className = 'task-item' + (task.completed ? ' completed' : '');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-check';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', 'Mark task as completed');
    checkbox.addEventListener('change', function () {
      toggleTask(task.id);
    });

    const taskMain = document.createElement('div');
    taskMain.className = 'task-main';

    const title = document.createElement('span');
    title.className = 'task-title';
    title.textContent = task.title;

    const meta = document.createElement('div');
    meta.className = 'task-meta';

    const subject = document.createElement('span');
    subject.className = 'pill';
    subject.textContent = task.subject;

    const priority = document.createElement('span');
    priority.className = 'pill ' + task.priority.toLowerCase();
    priority.textContent = task.priority + ' priority';

    meta.append(subject, priority);
    taskMain.append(title, meta);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.type = 'button';
    deleteButton.textContent = '×';
    deleteButton.setAttribute('aria-label', 'Delete task');
    deleteButton.addEventListener('click', function () {
      deleteTask(task.id);
    });

    listItem.append(checkbox, taskMain, deleteButton);
    taskList.appendChild(listItem);
  });

  // Update the task counters.
  const completed = tasks.filter(task => task.completed).length;
  document.getElementById('totalCount').textContent = tasks.length;
  document.getElementById('pendingCount').textContent = tasks.length - completed;
  document.getElementById('completedCount').textContent = completed;
  document.getElementById('taskLabel').textContent =
    tasks.length + (tasks.length === 1 ? ' task' : ' tasks');
  document.getElementById('visibleCount').textContent =
    'Showing ' + visibleTasks.length + ' tasks';

  emptyMessage.style.display = visibleTasks.length === 0 ? 'block' : 'none';
}

// Handle the All / Pending / Completed filter buttons.
document.querySelectorAll('.filter').forEach(function (button) {
  button.addEventListener('click', function () {
    currentFilter = button.dataset.filter;

    document.querySelectorAll('.filter').forEach(function (filterButton) {
      filterButton.classList.remove('active');
    });
    button.classList.add('active');
    renderTasks();
  });
});

// Render saved tasks when the page first opens.
renderTasks();
