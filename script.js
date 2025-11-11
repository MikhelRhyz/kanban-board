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

[todoTaskList, doingTaskList, doneTaskList].forEach((list) => {
  list.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  list.addEventListener("drop", handleDrop);
});

let dragstartId = null;
const showArchived = document.getElementById("showArchived");

renderTasks();

showArchived.addEventListener("change", (e) => {
  const archivedTasks = tasks.filter((task) => task.archived);
  archivedTasks.forEach((task) => {
    const article = document.createElement("article");
    article.className = "task-card d-flex archived";
    article.draggable = true;
    article.dataset.taskId = task.id;
    const div = document.createElement("div");
    div.className = "task-title";
    div.textContent = `${task.title} (Archived)`;
    article.appendChild(div);
    if (e.target.checked) {
      if (task.column === "todo") {
        todoTaskList.appendChild(article);
      }
      if (task.column === "doing") {
        doingTaskList.appendChild(article);
      }
      if (task.column === "done") {
        doneTaskList.appendChild(article);
      }
    } else {
      const archivedArticle = document.querySelector(
        `article.task-card.archived[data-task-id='${task.id}']`
      );
      if (archivedArticle) {
        archivedArticle.remove();
      }
    }
  });
});

function handleDrop(e) {
  const newColumn = this.closest("[data-column-id]").dataset.columnId;

  tasks = tasks.map((task) => {
    if (task.id === dragstartId) {
      task.column = newColumn;
    }
    return task;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  renderTasks();
}

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
    id: crypto.randomUUID(),
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
    if (task.archived) {
      return;
    }

    const article = document.createElement("article");
    article.className = "task-card d-flex";
    article.draggable = true;
    article.dataset.taskId = task.id;
    const div = document.createElement("div");
    div.className = "task-title";
    div.textContent = `${task.title}`;
    const button = document.createElement("button");
    button.className = "task-archive-button";
    button.textContent = "Archive";

    button.addEventListener("click", () => {
      const task = tasks.find((t) => t.id === article.dataset.taskId);
      task.archived = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      renderTasks();
    });

    article.appendChild(div);
    article.appendChild(button);

    if (task.column === "todo") {
      todoTaskList.appendChild(article);
    }

    if (task.column === "doing") {
      doingTaskList.appendChild(article);
    }

    if (task.column === "done") {
      doneTaskList.appendChild(article);
    }

    article.addEventListener("dragstart", handleDragStart);
  });

  function handleDragStart(e) {
    dragstartId = this.dataset.taskId;
  }
}
