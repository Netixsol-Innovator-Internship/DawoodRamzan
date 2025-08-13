import { useState } from "react";
import api from "../services/api";

function TaskList({ tasks, setTasks }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    completed: false,
  });

  const handleDelete = async (taskId) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
      setError(err.response?.data?.message || "Failed to delete task");

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskStatus = async (taskId) => {
    setLoading(true);
    setError(null);
    try {
      const taskToUpdate = tasks.find((task) => task.id === taskId);
      const updatedTask = {
        ...taskToUpdate,
        completed: !taskToUpdate.completed,
      };

      const res = await api.put(`/tasks/${taskId}`, updatedTask);
      setTasks(tasks.map((task) => (task.id === taskId ? res.data : task)));
    } catch (err) {
      console.error("Error updating task:", err);
      setError(err.response?.data?.message || "Failed to update task");

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (task) => {
    setEditingTask(task.id);
    setEditForm({
      title: task.title,
      description: task.description || "",
      completed: task.completed,
    });
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setEditForm({ title: "", description: "", completed: false });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submitEdit = async (taskId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.put(`/tasks/${taskId}`, editForm);
      setTasks(tasks.map((task) => (task.id === taskId ? res.data : task)));
      setEditingTask(null);
    } catch (err) {
      console.error("Error updating task:", err);
      setError(err.response?.data?.message || "Failed to update task");

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Task List</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {tasks.length === 0 ? (
        <p className="text-gray-500">
          No tasks yet. Add your first task above!
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white shadow-md rounded-lg p-4 border relative transition-all duration-200 hover:shadow-lg ${
                task.completed ? "opacity-80" : ""
              }`}
            >
              {editingTask === task.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                    placeholder="Task title"
                  />
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                    placeholder="Task description"
                    rows="3"
                  />
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="completed"
                      id={`completed-${task.id}`}
                      checked={editForm.completed}
                      onChange={handleEditChange}
                      className="mr-2"
                    />
                    <label htmlFor={`completed-${task.id}`}>
                      {editForm.completed ? "Completed" : "Pending"}
                    </label>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={cancelEditing}
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => submitEdit(task.id)}
                      disabled={loading || !editForm.title.trim()}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-800">
                      {task.title}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditing(task)}
                        disabled={loading}
                        className="text-blue-500 hover:text-blue-700 disabled:opacity-50"
                        title="Edit task"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        disabled={loading}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50"
                        title="Delete task"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 mt-2">{task.description}</p>

                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      disabled={loading}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        task.completed
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      } disabled:opacity-50`}
                    >
                      {task.completed ? "Completed" : "Pending"}
                    </button>

                    <span className="text-xs text-gray-500">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="mt-4 text-center text-gray-500">Processing...</div>
      )}
    </div>
  );
}

export default TaskList;
