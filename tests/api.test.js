import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { resetStore } from "../src/store.js";

beforeEach(() => {
  resetStore();
});

describe("API", () => {
  it("GET /api/tasks returns empty array", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("POST /api/tasks creates a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "Test task" });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Test task");
    expect(res.body.completed).toBe(false);
  });

  it("POST /api/tasks rejects empty title", async () => {
    const res = await request(app).post("/api/tasks").send({ title: "" });
    expect(res.status).toBe(400);
  });

  it("GET /api/tasks/:id returns a task", async () => {
    await request(app).post("/api/tasks").send({ title: "Find me" });
    const res = await request(app).get("/api/tasks/1");
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Find me");
  });

  it("GET /api/tasks/:id returns 404 for missing", async () => {
    const res = await request(app).get("/api/tasks/999");
    expect(res.status).toBe(404);
  });

  it("PATCH /api/tasks/:id updates a task", async () => {
    await request(app).post("/api/tasks").send({ title: "Before" });
    const res = await request(app)
      .patch("/api/tasks/1")
      .send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  it("DELETE /api/tasks/:id removes a task", async () => {
    await request(app).post("/api/tasks").send({ title: "Bye" });
    const res = await request(app).delete("/api/tasks/1");
    expect(res.status).toBe(204);

    const list = await request(app).get("/api/tasks");
    expect(list.body).toHaveLength(0);
  });
});
