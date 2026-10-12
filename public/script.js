
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const message = document.getElementById("message");

async function loadTasks() {
  try {
    const response = await fetch("/api/tasks");
    const tasks = await response.json();

    taskList.innerHTML = "";

    tasks.forEach((task) => {
      const li = document.createElement("li");

      if (task.completed) {
        li.classList.add("completed");
      }

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.setAttribute("aria-label", "Complete task");

      checkbox.addEventListener("change", async () => {
        await fetch(`/api/tasks/${task.id}`, {
          method: "PATCH"
        });

        loadTasks();
      });

      const span = document.createElement("span");
      span.textContent = task.title;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "delete-btn";

      deleteButton.addEventListener("click", async () => {
        await fetch(`/api/tasks/${task.id}`, {
          method: "DELETE"
        });

        loadTasks();
      });

      li.append(checkbox, span, deleteButton);
      taskList.appendChild(li);
    });
  } catch (error) {
    message.textContent = "Unable to load tasks. Check the server.";
  }
}

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = taskInput.value.trim();

  if (!title) return;

  try {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title })
    });

    const result = await response.json();

    if (!response.ok) {
      message.textContent = result.message;
      return;
    }

    taskInput.value = "";
    message.textContent = "";
    loadTasks();
  } catch (error) {
    message.textContent = "Unable to add task. Check the server.";
  }
});

loadTasks();
