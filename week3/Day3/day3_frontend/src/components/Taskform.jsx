import { useState } from "react";
import api from "../services/api";

function TaskForm({ setTasks }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const form = e.target;
      const newTask = {
        title: form.title.value,
        description: form.description.value,
        completed: form.completed.value === "true",
      };

      await api.post("/tasks", newTask);
      form.reset();

      // Fetch updated task list
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (err) {
      console.error("Error adding task:", err);
      setError(err.response?.data?.message || "Failed to create task");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex items-center justify-center bg-gray-100 py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-gray-700">
          Add Task
        </h1>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
        )}

        {/* Rest of your form fields remain the same */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-600"
          >
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            minLength="3"
            maxLength="100"
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-600"
          >
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows="3"
            maxLength="500"
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="completed"
            className="block text-sm font-medium text-gray-600"
          >
            Completed:
          </label>
          <select
            id="completed"
            name="completed"
            required
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="false">Pending</option>
            <option value="true">Completed</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Adding..." : "Add Task"}
        </button>
      </form>
    </div>
  );
}

export default TaskForm;
