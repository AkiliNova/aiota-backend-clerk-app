"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
};

function CreateUserForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("teacher");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

  const splitFullName = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    return {
      firstName: parts[0],
      lastName: parts.slice(1).join(" ") || "",
    };
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { firstName, lastName } = splitFullName(name);

    try {
      await axios.post("/api/admin/users", {
        email,
        password,
        role,
        firstName,
        lastName,
      });

      setEmail("");
      setName("");
      setPassword("");
      setRole("teacher");

      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 border rounded shadow-sm max-w-md w-full"
    >
      <h2 className="text-lg font-semibold mb-3">Create New User</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Full Name"
          className="input input-bordered w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="input input-bordered w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="input input-bordered w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          className="input input-bordered w-full"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
          <option value="security">Security</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </div>
    </form>
  );
}

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get<User[]>("/api/admin/users")
      .then((res) => setUsers(res.data))
      .then(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <div className="mb-6 flex flex-col lg:flex-row justify-between gap-4">
        <h1 className="text-xl font-bold">User Management</h1>
        <CreateUserForm onSuccess={fetchUsers} />
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        {loading ? (
          <p className="p-4">Loading users...</p>
        ) : (
          <table className="table w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2 capitalize">{user.role}</td>
                  <td className="p-2">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
