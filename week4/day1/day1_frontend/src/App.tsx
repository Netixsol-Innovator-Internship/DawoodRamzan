// src/App.tsx
import React, { useState, useEffect } from "react";
import { Task } from "./types";

const STORAGE_KEY = "tasks";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // Load tasks from localStorage (and then sync with backend)
  useEffect(() => {
    const localData = localStorage.getItem(STORAGE_KEY);
    if (localData) {
      setTasks(JSON.parse(localData));
    }
    fetchTasks();
  }, []);

  // Keep localStorage in sync whenever tasks change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/tasks");
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.warn("⚠️ Backend not available, using localStorage only.");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!title.trim()) {
      alert("Task title is required!");
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      title,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTitle("");

    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const savedTask = await res.json();

      setTasks((prev) =>
        prev.map((t) => (t.id === newTask.id ? savedTask : t))
      );
    } catch {
      console.warn("⚠️ Task saved only in localStorage (offline mode).");
    }
  };

  const toggleTask = async (id: number) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
      });
      const updatedTask = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
    } catch {
      console.warn("⚠️ Toggle saved only in localStorage (offline mode).");
    }
  };

  const deleteTask = async (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));

    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
      });
    } catch {
      console.warn("⚠️ Delete saved only in localStorage (offline mode).");
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-blue-600">
          ✅ Todo App
        </h1>

        {/* Add Task Input */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter new task..."
            className="border p-3 flex-1 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
          />
          <button
            onClick={addTask}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-lg shadow transition text-sm sm:text-base"
          >
            Add
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500 mb-4">Loading tasks...</p>
        )}

        {/* Task List */}
        <ul className="space-y-3 max-h-72 sm:max-h-80 overflow-y-auto pr-1 sm:pr-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <span
                onClick={() => toggleTask(task.id)}
                className={`cursor-pointer select-none text-sm sm:text-base ${
                  task.completed
                    ? "line-through text-gray-400"
                    : "text-gray-800"
                }`}
              >
                {task.title}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700 transition text-lg"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>

        {/* Stats */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 p-3 rounded-lg">
          <span>✅ Completed: {completedCount}</span>
          <span>⏳ Pending: {pendingCount}</span>
          <span>📋 Total: {tasks.length}</span>
        </div>
      </div>
    </div>
  );
};

export default App;
