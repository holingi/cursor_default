import { describe, it, expect, beforeEach } from "vitest";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  resetStore,
} from "../src/store.js";

beforeEach(() => {
  resetStore();
});

describe("Store", () => {
  it("starts empty", () => {
    expect(getAllTasks()).toEqual([]);
  });

  it("creates a task", () => {
    const task = createTask("Buy milk");
    expect(task).toMatchObject({ id: 1, title: "Buy milk", completed: false });
    expect(getAllTasks()).toHaveLength(1);
  });

  it("retrieves a task by id", () => {
    createTask("First");
    createTask("Second");
    const task = getTaskById(2);
    expect(task.title).toBe("Second");
  });

  it("returns undefined for missing id", () => {
    expect(getTaskById(999)).toBeUndefined();
  });

  it("updates a task", () => {
    createTask("Original");
    const updated = updateTask(1, { title: "Changed", completed: true });
    expect(updated.title).toBe("Changed");
    expect(updated.completed).toBe(true);
  });

  it("returns null when updating non-existent task", () => {
    expect(updateTask(999, { title: "x" })).toBeNull();
  });

  it("deletes a task", () => {
    createTask("To delete");
    expect(deleteTask(1)).toBe(true);
    expect(getAllTasks()).toHaveLength(0);
  });

  it("returns false when deleting non-existent task", () => {
    expect(deleteTask(999)).toBe(false);
  });
});
