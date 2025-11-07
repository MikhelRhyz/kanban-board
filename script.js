const title = document.querySelector('input[name="title"]');
const description = document.querySelector('textarea[name="description"]');
const column = document.querySelector('select[name="column"]');
const taskForm = document.getElementById("taskForm");
const STORAGE_KEY = "kanban_tasks";
const savedTask = localStorage.getItem(STORAGE_KEY);
let tasks = [];
const todoTaskList = document.querySelector(
  "div[data-column-id='todo'] .task-list"
);
const taskModal = document.getElementById("taskModal");
const doingTaskList = document.querySelector(""); // For future use select doing column task list

if (savedTask) {
  tasks = JSON.parse(savedTask);
}

renderTasks();

taskForm.addEventListener("submit", (e) => {
  const backdrop = document.querySelector(".modal-backdrop");
  if (backdrop) {
    backdrop.remove();
  }
  e.preventDefault();
  const task = {
    title: title.value,
    description: description.value,
    column: column.value,
  };

  tasks.push(task);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  renderTasks();
  taskModal.style = "display: none;";
});

function renderTasks() {
  todoTaskList.innerHTML = "";
  // Function to render tasks on the Kanban board
  tasks.forEach((task) => {
    const article = document.createElement("article");
    article.className = "task-card";
    const div = document.createElement("div");
    div.className = "task-title";
    div.innerHTML = `${task.title}`;

    article.appendChild(div);
    if (task.column === "todo") {
      todoTaskList.appendChild(article);
    }
  });
}
