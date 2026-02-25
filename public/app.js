const API = "/api/tasks";
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const empty = document.getElementById("empty-state");
const stats = document.getElementById("stats");

async function fetchTasks() {
  const res = await fetch(API);
  const tasks = await res.json();
  render(tasks);
}

function render(tasks) {
  list.innerHTML = "";

  if (tasks.length === 0) {
    empty.style.display = "block";
    stats.textContent = "";
    return;
  }

  empty.style.display = "none";

  const done = tasks.filter((t) => t.completed).length;
  stats.textContent = `${tasks.length} task${tasks.length !== 1 ? "s" : ""} \u2022 ${done} completed`;

  tasks.forEach((task) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = task.completed;
    cb.addEventListener("change", () => toggleTask(task.id, !task.completed));

    const span = document.createElement("span");
    span.className = "title";
    span.textContent = task.title;
    span.addEventListener("click", () => toggleTask(task.id, !task.completed));

    const del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "\u00d7";
    del.title = "Delete task";
    del.addEventListener("click", () => removeTask(task.id));

    li.append(cb, span, del);
    list.appendChild(li);
  });
}

async function addTask(title) {
  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  await fetchTasks();
}

async function toggleTask(id, completed) {
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
  await fetchTasks();
}

async function removeTask(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  await fetchTasks();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  input.value = "";
  addTask(title);
});

fetchTasks();
