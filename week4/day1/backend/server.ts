const express = require("express");
const cors = require("cors");
import type { Request, Response } from "express";
import type { Task } from "./types";

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
app.use(cors());
app.use(express.json());

let tasks: Task[] = [];
let nextId = 1;

/* ---------------- Swagger Setup ---------------- */
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo API",
      version: "1.0.0",
      description: "Simple Task API with CRUD operations",
    },
    servers: [
      {
        url: "http://localhost:5000", // local server
        description: "Local server",
      },
      {
        url: "https://dawoodweek4-day1-backend.vercel.app", // deployed server
        description: "Production server",
      },
    ],
  },
  apis: ["./server.ts"], // path to your file(s) with annotations
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ---------------- Routes ---------------- */

/**
 * @openapi
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     responses:
 *       200:
 *         description: List of tasks
 */
app.get("/api/tasks", (req: Request, res: Response) => {
  res.json(tasks);
});

/**
 * @openapi
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created
 *       400:
 *         description: Title is required
 */
app.post("/api/tasks", (req: Request, res: Response) => {
  const { title } = req.body;
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }
  const newTask: Task = { id: nextId++, title, completed: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

/**
 * @openapi
 * /api/tasks/{id}:
 *   put:
 *     summary: Toggle a task complete/incomplete
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task updated
 *       404:
 *         description: Task not found
 */
app.put("/api/tasks/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  const task = tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  task.completed = !task.completed;
  res.json(task);
});

/**
 * @openapi
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Task deleted
 */
app.delete("/api/tasks/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  tasks = tasks.filter((t) => t.id !== id);
  res.status(204).send();
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(
    `✅ Server running on http://localhost:${PORT}\n📖 Swagger docs at http://localhost:${PORT}/api-docs`
  )
);
