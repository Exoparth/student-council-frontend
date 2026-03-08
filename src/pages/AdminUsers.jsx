import { useEffect, useState } from "react";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../api/userApi";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingUser, setEditingUser] = useState(null);

  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await createUser(newUser);
      fetchUsers();

      setNewUser({
        fullName: "",
        email: "",
        password: "",
        role: "student",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateUser(editingUser._id, editingUser);

      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <div className="p-10">Loading users...</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">Manage Users</h1>

      {/* CREATE USER */}

      <div className="bg-white p-6 rounded-xl shadow-md mb-10">
        <h2 className="font-semibold mb-4">Create User</h2>

        <div className="grid grid-cols-4 gap-4">
          <input
            placeholder="Full Name"
            value={newUser.fullName}
            onChange={(e) =>
              setNewUser({ ...newUser, fullName: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="border p-2 rounded"
          />

          <input
            placeholder="Password"
            type="password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            className="border p-2 rounded"
          />

          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          onClick={handleCreate}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create User
        </button>
      </div>

      {/* USERS TABLE */}

      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                {/* NAME */}

                <td className="p-3">
                  {editingUser?._id === user._id ? (
                    <input
                      value={editingUser.fullName}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          fullName: e.target.value,
                        })
                      }
                      className="border p-1 rounded"
                    />
                  ) : (
                    user.fullName
                  )}
                </td>

                {/* EMAIL */}

                <td>{user.email}</td>

                {/* ROLE */}

                <td>
                  {editingUser?._id === user._id ? (
                    <select
                      value={editingUser.role}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          role: e.target.value,
                        })
                      }
                      className="border p-1 rounded"
                    >
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>

                {/* ACTIONS */}

                <td className="flex gap-3 p-3">
                  {editingUser?._id === user._id ? (
                    <>
                      <button
                        onClick={handleUpdate}
                        className="text-green-600 font-semibold"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => setEditingUser(null)}
                        className="text-gray-500"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingUser(user)}
                        className="text-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;
