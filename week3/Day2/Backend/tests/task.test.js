const request = require("supertest");
const express = require("express");
const taskRoutes = require("../routes/taskRoutes");
const Task = require("../models/task");

const app = express();
app.use(express.json());
app.use("/api/tasks", taskRoutes);

describe("Task API", () => {
  it("should create a task", async () => {
    const res = await request(app).post("/api/tasks").send({
      title: "Test Task",
      description: "This is a test task",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.task.title).toBe("Test Task");

    const task = await Task.findOne({ title: "Test Task" });
    expect(task).not.toBeNull();
  });

  it("should fetch all tasks", async () => {
    await new Task({ title: "Task 1", description: "Desc 1" }).save();
    await new Task({ title: "Task 2", description: "Desc 2" }).save();

    const res = await request(app).get("/api/tasks");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it("should update a task", async () => {
    const task = await new Task({ title: "Old Title" }).save();

    const res = await request(app)
      .put(`/api/tasks/${task.id}`)
      .send({ title: "New Title" });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("New Title");
  });

  it("should delete a task", async () => {
    const task = await new Task({ title: "Delete Me" }).save();

    const res = await request(app).delete(`/api/tasks/${task.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Task deleted successfully");

    const deleted = await Task.findOne({ id: task.id });
    expect(deleted).toBeNull();
  });
});
