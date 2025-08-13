import { useState, useEffect } from "react";
import "./App.css";
import LoginPage from "./Pages/LoginPage";
import Dashboard from "./Pages/Dashboard";

function App() {
  const [activePage, setActivePage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check token on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // Set initial page based on login status
    if (!token) {
      setActivePage("dashboard");
    }
  }, []);

  // Handle login success
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setActivePage("dashboard");
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setActivePage("login");
  };

  // Protect dashboard navigation
  const handleNavigateDashboard = () => {
    if (!isLoggedIn) {
      alert("You must log in first!");
      setActivePage("login");
    } else {
      setActivePage("dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome</h1>

      {/* Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActivePage("login")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Login
        </button>
        <button
          onClick={handleNavigateDashboard}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Dashboard
        </button>
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        )}
      </div>

      {/* Page rendering */}
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
        {activePage === "login" && (
          <LoginPage onLoginSuccess={handleLoginSuccess} />
        )}
        {activePage === "dashboard" && isLoggedIn && <Dashboard />}
        {!activePage && (
          <p className="text-gray-500 text-center">
            Please choose an option above.
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
