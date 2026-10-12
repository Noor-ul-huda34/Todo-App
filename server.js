
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

let tasks = [];
let nextId = 1;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Get all tasks
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// Add a new task
app.post("/api/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Task is required" });
  }

  const task = {
    id: nextId++,
    title: title.trim(),
    completed: false
  };

  tasks.push(task);
  res.status(201).json(task);
});

// Mark task as completed or incomplete
app.patch("/api/tasks/:id", (req, res) => {
  const task = tasks.find(
    (t) => t.id === Number(req.params.id)
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  task.completed = !task.completed;
  res.json(task);
});

// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const exists = tasks.some((t) => t.id === taskId);

  if (!exists) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks = tasks.filter((t) => t.id !== taskId);
  res.json({ message: "Task deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
