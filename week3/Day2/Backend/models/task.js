const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    min: 1,
    max: 10000,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to auto-generate ID
taskSchema.pre("save", async function (next) {
  if (!this.id) {
    const lastTask = await mongoose.model("Task").findOne().sort({ id: -1 });
    this.id = lastTask ? lastTask.id + 1 : 1;
  }
  next();
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
