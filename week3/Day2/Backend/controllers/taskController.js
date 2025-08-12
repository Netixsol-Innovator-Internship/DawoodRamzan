const Task = require("../models/task");

exports.createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating task", error: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const id = Number(req.params.id);
    req.body.updatedAt = Date.now();

    const updatedTask = await Task.findOneAndUpdate({ id }, req.body, {
      new: true,
    });
    if (!updatedTask)
      return res.status(404).json({ message: "Task not found" });

    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deletedTask = await Task.findOneAndDelete({ id });
    if (!deletedTask)
      return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting task", error: err.message });
  }
};
