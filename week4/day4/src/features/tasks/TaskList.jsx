import { useState } from "react";
import {
  useGetTasksQuery,
  useAddTaskMutation,
  useToggleTaskMutation,
  useDeleteTaskMutation,
} from "./apiSlice";

export function TaskList() {
  const { data: tasks = [], isLoading, isError } = useGetTasksQuery();
  const [addTask] = useAddTaskMutation();
  const [toggleTask] = useToggleTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [title, setTitle] = useState("");

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  const handleAdd = async () => {
    if (title.trim()) {
      await addTask({ title });
      setTitle("");
    }
  };

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
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-lg shadow transition text-sm sm:text-base"
          >
            Add
          </button>
        </div>

        {/* Loading / Error */}
        {isLoading && (
          <p className="text-center text-gray-500 mb-4">Loading tasks...</p>
        )}
        {isError && (
          <p className="text-center text-red-500 mb-4">Something went wrong!</p>
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
}
