import { useEffect, useState } from "react";
import TaskList from "../components/TaskList";
import api from "../services/api";
import TaskForm from "../components/Taskform";

function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Verify token before fetching tasks
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login if no token
      window.location.href = "/";
      return;
    }

    async function fetchTasks() {
      try {
        const res = await api.get("/tasks");
        console.log("Fetched tasks:", res.data);
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        if (err.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("token");
          window.location.href = "/";
        }
      }
    }
    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <TaskForm setTasks={setTasks} />
      <TaskList tasks={tasks} setTasks={setTasks} />
    </div>
  );
}

export default Dashboard;
