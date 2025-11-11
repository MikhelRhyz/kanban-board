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
const doingTaskList = document.querySelector(
  "div[data-column-id='doing'] .task-list"
);
const doneTaskList = document.querySelector(
  "div[data-column-id='done'] .task-list"
);

if (savedTask) {
  const parsed = JSON.parse(savedTask);
  tasks = Array.isArray(parsed) ? parsed : [];
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
  taskForm.reset();
  taskModal.style = "display: none;";
});

function renderTasks() {
  todoTaskList.innerHTML = "";
  doingTaskList.innerHTML = "";
  doneTaskList.innerHTML = "";
  // Function to render tasks on the Kanban board
  tasks.forEach((task) => {
    const article = document.createElement("article");
    article.className = "task-card";
    const div = document.createElement("div");
    div.className = "task-title";
    div.textContent = `${task.title}`;

    article.appendChild(div);
    if (task.column === "todo") {
      todoTaskList.appendChild(article);
    }

    if (task.column === "doing") {
      doingTaskList.appendChild(article);
    }

    if (task.column === "done") {
      doneTaskList.appendChild(article);
    }
  });
}
