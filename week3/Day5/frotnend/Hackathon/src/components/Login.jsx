import { useState } from "react";
import { useLoginMutation } from "../features/api/apiSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // RTK Query mutation hook
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // unwrap() gives the actual response or throws an error
      const response = await login(form).unwrap();
      console.log("Login response:", response);

      // Store token, role, and user in localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.role);
      localStorage.setItem("user", JSON.stringify(response.user));

      alert("Login successful");

      // Redirect based on role
      if (response.role === "admin" || response.role === "super admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      // RTK Query errors can be structured or string
      const message = err?.data?.message || err?.error || "Login failed";
      alert(message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="border w-full p-2 mb-3"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border w-full p-2 mb-3"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white w-full py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

// import { useState } from "react";
// import { login } from "../services/api";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await login(form);
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("role", data.role); // role now comes directly
//       localStorage.setItem("user", JSON.stringify(data.user)); // store full user object

//       console.log("Login successful:", data);
//       alert("Login successful");
//       // Redirect based on role
//       if (data.role === "admin" || data.role === "super admin") {
//         navigate("/admin");
//       } else {
//         navigate("/"); // normal users -> homepage
//       }
//     } catch (err) {
//       alert(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded shadow-md w-80"
//       >
//         <h2 className="text-xl font-bold mb-4">Login</h2>
//         <input
//           type="email"
//           placeholder="Email"
//           className="border w-full p-2 mb-3"
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="border w-full p-2 mb-3"
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//         />
//         <button className="bg-green-600 text-white w-full py-2 rounded">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }
