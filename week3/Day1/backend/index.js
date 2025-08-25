const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const app = express();
const data = require("./data.json");
app.use(express.json());

const PORT = 8000;

// Swagger options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tasks API",
      version: "1.0.0",
      description: "A simple Express Tasks API",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
      {
        url: `https://dawood-week3-day1-backend.vercel.app`,
      },
    ],
  },
  apis: ["./index.js"], // files containing annotations as above
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the task to get
 *     responses:
 *       200:
 *         description: The task description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *             example:
 *               id: 5
 *               title: "Learn about middleware"
 *               completed: false
 *       404:
 *         description: Task not found
 */
app.get("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = data.find((task) => task.id === id);
  if (task) {
    res.json(task);
  } else {
    res.status(404).send("Task not found");
  }
});

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *           example:
 *             title: "New task to complete"
 *     responses:
 *       201:
 *         description: The created task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *             example:
 *               id: 12
 *               title: "New task to complete"
 *               completed: true
 */
app.post("/api/tasks", (req, res) => {
  const newTask = {
    id: data.length + 1,
    title: req.body.title,
    completed: true,
  };
  console.log(`Creating task: ${newTask.title}`);
  data.push(newTask);
  res.status(201).json(newTask);
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the task to delete
 *     responses:
 *       204:
 *         description: Task was deleted
 *         content:
 *           application/json:
 *             example:
 *               id: 5
 *               title: "Learn about middleware"
 *               completed: false
 *       404:
 *         description: Task not found
 */
app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = data.find((task) => task.id === id);
  if (task) {
    const index = data.indexOf(task);
    data.splice(index, 1);
    res.status(204).json(task);
  } else {
    res.status(404).send("Task not found");
  }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the task to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *           example:
 *             title: "Updated task title"
 *             completed: true
 *     responses:
 *       200:
 *         description: The updated task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *             example:
 *               id: 5
 *               title: "Updated task title"
 *               completed: true
 *       404:
 *         description: Task not found
 */
app.put("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = data.find((task) => task.id === id);
  if (task) {
    (task.title = req.body.title), (task.completed = req.body.completed);
    res.status(200).json(task);
  } else {
    res.status(404).send("task not found");
  }
});

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Get tasks statistics
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Tasks statistics
 *         content:
 *           application/json:
 *             example:
 *               total: 10
 *               completed: 3
 *               pending: 7
 */
app.get("/api/stats", (req, res) => {
  const totalTasks = data.length;
  const completedTasks = data.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const stats = {
    total: totalTasks,
    completed: completedTasks,
    pending: pendingTasks,
  };

  res.json(stats);
});

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks or filter by title
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Title to filter tasks (case insensitive partial match)
 *     responses:
 *       200:
 *         description: A list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *             examples:
 *               allTasks:
 *                 value:
 *                   - id: 2
 *                     title: "Set up Node.js environment"
 *                     completed: false
 *                   - id: 3
 *                     title: "Install Nodemon"
 *                     completed: true
 *               filteredTasks:
 *                 summary: Tasks filtered by title
 *                 value:
 *                   - id: 5
 *                     title: "Learn about middleware"
 *                     completed: false
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the task
 *         title:
 *           type: string
 *           description: The title of your task
 *         completed:
 *           type: boolean
 *           description: Whether the task is completed
 *       example:
 *         id: 1
 *         title: "Learn Swagger"
 *         completed: false
 */
app.get("/api/tasks", (req, res) => {
  const { title } = req.query;

  if (title) {
    const filteredTasks = data.filter((task) =>
      task.title.toLowerCase().includes(title.toLowerCase())
    );
    return res.json(filteredTasks);
  }

  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
