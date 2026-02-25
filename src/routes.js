import { Router } from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "./store.js";

const router = Router();

router.get("/tasks", (_req, res) => {
  res.json(getAllTasks());
});

router.get("/tasks/:id", (req, res) => {
  const task = getTaskById(Number(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
});

router.post("/tasks", (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }
  const task = createTask(title.trim());
  res.status(201).json(task);
});

router.patch("/tasks/:id", (req, res) => {
  const task = updateTask(Number(req.params.id), req.body);
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
});

router.delete("/tasks/:id", (req, res) => {
  const ok = deleteTask(Number(req.params.id));
  if (!ok) return res.status(404).json({ error: "Task not found" });
  res.status(204).end();
});

export default router;
