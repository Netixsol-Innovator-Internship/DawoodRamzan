"use client";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetTeasQuery,
  useCreateTeaMutation,
  useUpdateTeaMutation,
  useDeleteTeaMutation,
} from "../features/api/apiSlice";
import { useState } from "react";
import UserTable from "./UserTable";
import TeaTable from "./TeaTable";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate(); // initialize navigate

  // ----- USERS -----
  const { data: users = [], isLoading: loadingUsers } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const filteredUsers = currentUser?.email
    ? users.filter((u) => u.email !== currentUser.email)
    : users;

  // ---- User Grouping ----
  const groupedUsers = {
    "super admin": filteredUsers.filter((u) => u.role === "super admin"),
    admin: filteredUsers.filter((u) => u.role === "admin"),
    user: filteredUsers.filter((u) => u.role === "user"),
  };

  // ----- TEAS -----
  const { data: teas = [], isLoading: loadingTeas } = useGetTeasQuery();
  const [createTea] = useCreateTeaMutation();
  const [updateTea] = useUpdateTeaMutation();
  const [deleteTea] = useDeleteTeaMutation();

  const [newTea, setNewTea] = useState({ name: "", price: "" });
  const [editingTea, setEditingTea] = useState(null);

  // ---- Role Access ----
  const role = localStorage.getItem("role")?.toLowerCase();

  // ---- Navigation Function ----
  const moveToHome = () => {
    navigate("/");
  };

  if (loadingUsers || loadingTeas)
    return (
      <p className="text-center text-lg font-semibold animate-pulse">
        Loading...
      </p>
    );

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-indigo-50 px-4 sm:px-10 md:px-16 lg:px-20 xl:px-48">
      <h1 className="text-3xl font-bold text-center mb-10">Admin Dashboard</h1>

      {/* Home Button */}
      <div className="text-center mb-8">
        <button
          onClick={moveToHome}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Home Page
        </button>
      </div>

      <div className="space-y-12">
        {/* Users */}
        {role === "admin" ? (
          <UserTable
            title="User"
            data={groupedUsers.user}
            updateUser={updateUser}
            deleteUser={deleteUser}
          />
        ) : (
          <>
            <UserTable
              title="Super Admin"
              data={groupedUsers["super admin"]}
              updateUser={updateUser}
              deleteUser={deleteUser}
            />
            <UserTable
              title="Admin"
              data={groupedUsers.admin}
              updateUser={updateUser}
              deleteUser={deleteUser}
            />
            <UserTable
              title="User"
              data={groupedUsers.user}
              updateUser={updateUser}
              deleteUser={deleteUser}
            />
          </>
        )}

        {/* Teas */}
        <TeaTable
          teas={teas}
          newTea={newTea}
          setNewTea={setNewTea}
          editingTea={editingTea}
          setEditingTea={setEditingTea}
          createTea={createTea}
          updateTea={updateTea}
          deleteTea={deleteTea}
          role={role}
        />
      </div>
    </div>
  );
}
