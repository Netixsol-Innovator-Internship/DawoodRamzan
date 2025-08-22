export default function UserTable({ title, data, updateUser, deleteUser }) {
  // ---- Role Options ----
  const getRoleOptions = (role) => {
    if (role === "super admin") return ["super admin", "admin"];
    if (role === "admin") return ["admin", "user", "super admin"];
    return ["user", "admin"];
  };

  return (
    <div className="mb-12">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800 border-b-2 border-indigo-500 inline-block pb-1">
        {title} Table
      </h2>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full min-w-max border-collapse text-sm md:text-base">
          <thead>
            <tr className="bg-indigo-100 text-indigo-800">
              <th className="border p-3">Name</th>
              <th className="border p-3">Email</th>
              <th className="border p-3">Role</th>
              <th className="border p-3">Blocked</th>
              <th className="border p-3">Change Role</th>
              <th className="border p-3">Block/Unblock</th>
              <th className="border p-3">Delete</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((u) => (
                <tr
                  key={u._id}
                  className="text-center hover:bg-indigo-50 transition"
                >
                  <td className="border p-3 font-medium">{u.name}</td>
                  <td className="border p-3 break-all text-gray-700">
                    {u.email}
                  </td>
                  <td className="border p-3 capitalize">{u.role}</td>
                  <td className="border p-3">{u.blocked ? "✅ Yes" : "—"}</td>

                  {/* Role Change Dropdown */}
                  <td className="border p-3">
                    <select
                      value={u.role}
                      onChange={(e) =>
                        updateUser({
                          id: u._id,
                          data: { role: e.target.value },
                        })
                      }
                      className="border px-2 py-1 rounded w-full md:w-auto focus:ring focus:ring-indigo-300"
                    >
                      {getRoleOptions(u.role).map((r) => (
                        <option key={r} value={r}>
                          {r.charAt(0).toUpperCase() + r.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Block/Unblock */}
                  <td className="border p-3">
                    <button
                      className={`${
                        u.blocked ? "bg-green-500" : "bg-yellow-500"
                      } text-white px-3 py-1 rounded shadow hover:opacity-90 transition w-full md:w-auto`}
                      onClick={() =>
                        updateUser({ id: u._id, data: { blocked: !u.blocked } })
                      }
                    >
                      {u.blocked ? "Unblock" : "Block"}
                    </button>
                  </td>

                  {/* Delete */}
                  <td className="border p-3">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600 transition w-full md:w-auto"
                      onClick={() => deleteUser(u._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="border p-4 text-center text-gray-500"
                  colSpan="7"
                >
                  No {title}s found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
