import { useState } from "react";
import { useSignupMutation } from "../features/api/apiSlice";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  // RTK Query mutation hook
  const [signup, { isLoading }] = useSignupMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signup(form).unwrap(); // unwrap returns actual response or throws error
      console.log("Signup successful:", response);

      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      const message = err?.data?.message || err?.error || "Signup failed";
      alert(message);
      console.log("Signup error:", message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4">Signup</h2>

        <input
          type="text"
          placeholder="Name"
          className="border w-full p-2 mb-3"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

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
          {isLoading ? "Signing up..." : "Signup"}
        </button>
      </form>
    </div>
  );
}

// import { useState } from "react";
// import { signup } from "../services/api";
// import { useNavigate } from "react-router-dom";

// export default function Signup() {
//   const [form, setForm] = useState({ name: "", email: "", password: "" });
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await signup(form);
//       alert("Signup successful! Please login.");
//       navigate("/login");
//     } catch (err) {
//       alert(err.response?.data?.message || "Signup failed");
//       console.log(err.response?.data?.message || "Failed");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded shadow-md w-80"
//       >
//         <h2 className="text-xl font-bold mb-4">Signup</h2>
//         <input
//           type="text"
//           placeholder="Name"
//           className="border w-full p-2 mb-3"
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//         />
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
//           Signup
//         </button>
//       </form>
//     </div>
//   );
// }
