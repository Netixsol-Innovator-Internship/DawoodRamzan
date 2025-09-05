/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Title from "@/components/admin/Title";
import DateRangePicker from "@/components/admin/DateRangePicker";
import { EllipsisVerticalIcon, UserIcon } from "lucide-react";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useAddPointsMutation,
  useSubPointsMutation,
  User,
} from "@/lib/services/usersApi";
import { useState } from "react";

export default function UsersPage() {
  const { data: users = [], isLoading, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [addPoints] = useAddPointsMutation();
  const [subPoints] = useSubPointsMutation();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const suspendedUsers = users.filter((u) => !u.isActive).length;

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
    }
  };

  const handleToggleStatus = async (user: User) => {
    await updateUser({
      id: user._id,
      body: { isActive: !user.isActive },
    });
  };

  const handleAddPoints = async (id: string) => {
    const pts = prompt("Enter points to add:");
    if (pts) {
      await addPoints({ id, points: parseInt(pts, 10) });
    }
  };

  const handleSubPoints = async (id: string) => {
    const pts = prompt("Enter points to subtract:");
    if (pts) {
      await subPoints({ id, points: parseInt(pts, 10) });
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Title title="Users" subtitle="Home > Users" />
        <DateRangePicker />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Users</p>
            <UserIcon size={20} className="text-white bg-black p-1 rounded" />
          </div>
          <h3 className="text-2xl font-bold">{totalUsers}</h3>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Active Users</p>
            <UserIcon
              size={20}
              className="text-white bg-green-600 p-1 rounded"
            />
          </div>
          <h3 className="text-2xl font-bold">{activeUsers}</h3>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Suspended Users</p>
            <UserIcon size={20} className="text-white bg-red-600 p-1 rounded" />
          </div>
          <h3 className="text-2xl font-bold">{suspendedUsers}</h3>
        </div>
      </div>

      {/* Users Table */}
      <div className="py-6 px-4 bg-[#fafafa] rounded-2xl">
        <div className="flex items-center justify-between mb-2 border-b border-[#232321]/20 pb-4">
          <p className="font-rubik font-semibold text-sm !text-black">
            Manage Users
          </p>
          <EllipsisVerticalIcon />
        </div>

        {isLoading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p className="text-red-500">Failed to load users.</p>
        ) : (
          <div className="relative h-4/5 mt-4 overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-[#232321]/20">
                <tr>
                  <td className="px-2 py-4 font-rubik font-medium">
                    <input type="checkbox" />
                  </td>
                  <td className="px-2 py-4 font-rubik font-medium text-[#232321]/80">
                    User ID
                  </td>
                  <td className="px-2 py-4 font-rubik font-medium text-[#232321]/80">
                    Name
                  </td>
                  <td className="px-2 py-4 font-rubik font-medium text-[#232321]/80">
                    Email
                  </td>
                  <td className="px-2 py-4 font-rubik font-medium text-[#232321]/80">
                    Role
                  </td>
                  <td className="px-2 py-4 font-rubik font-medium text-[#232321]/80">
                    Points
                  </td>
                  <td className="px-2 py-4 font-rubik font-medium text-[#232321]/80">
                    Joined
                  </td>
                  <td className="px-2 py-4 font-rubik font-medium text-[#232321]/80">
                    Status
                  </td>
                  <td className="px-2 py-4 font-rubik font-medium text-[#232321]/80">
                    Actions
                  </td>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-[#232321]/10 hover:bg-gray-50 transition"
                  >
                    <td className="px-2 py-4">
                      <input type="checkbox" />
                    </td>
                    <td className="px-2 py-4">{user._id}</td>
                    <td className="px-2 py-4">
                      {user.username || user.username}
                    </td>
                    <td className="px-2 py-4">{user.email}</td>
                    <td className="px-2 py-4">{user.role}</td>
                    <td className="px-2 py-4">{user.points}</td>
                    <td className="px-2 py-4">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td
                      className={`px-2 py-4 font-medium ${
                        user.isActive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {user.isActive ? "Active" : "Suspended"}
                    </td>
                    <td className="px-2 py-4 space-x-2">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                      >
                        {user.isActive ? "Suspend" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleAddPoints(user._id)}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        + Points
                      </button>
                      <button
                        onClick={() => handleSubPoints(user._id)}
                        className="px-3 py-1 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                      >
                        - Points
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
