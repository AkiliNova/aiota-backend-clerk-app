"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "@prisma/client";
import { useUser } from "@clerk/nextjs";

export default function UserPage() {
  const { user: currentUser } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "teacher",
    tenantId: "",
  });

  const fetchTenants = async () => {
    try {
      const res = await axios.get<any[]>("/api/tenant");
      setTenants(res.data);
    } catch (error) {
      console.error('Failed to fetch tenants:', error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get<User[]>("/api/admin/users");
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    // Only fetch tenants if super admin
    if (currentUser?.publicMetadata?.role === "admin" && !currentUser?.publicMetadata?.tenantId) {
      fetchTenants();
    } else if (currentUser?.publicMetadata?.tenantId) {
      setFormData(prev => ({ ...prev, tenantId: currentUser.publicMetadata.tenantId as string }));
    }
  }, [currentUser]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameParts = formData.name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    try {
      await axios.post("/api/admin/users", {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        firstName,
        lastName,
        tenantId: formData.tenantId,
      });

      setFormData({ name: "", email: "", password: "", role: "teacher", tenantId: "" });
      setShowModal(false);
      fetchUsers();
    } catch (error: any) {
      console.error('Failed to create user:', error.response?.data?.error || error.message);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-deepBlack">User Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-akiliRed text-white px-5 py-2 rounded shadow hover:opacity-90 transition"
        >
          Add User
        </button>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Total Users</p>
          <p className="text-xl font-bold">{users.length}</p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Active Users</p>
          <p className="text-xl font-bold">{users.length}</p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500 mb-1">New This Month</p>
          <p className="text-xl font-bold">5</p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Admins</p>
          <p className="text-xl font-bold">
            {users.filter((u) => u.role === "ADMIN").length}
          </p>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        {loading ? (
          <p className="p-4">Loading users...</p>
        ) : (
          <table className="table-auto w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Created</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 border-b">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

     {/* Modal */}
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
      {/* Close button */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-deepBlack text-2xl"
      >
        &times;
      </button>

      <h2 className="text-2xl font-bold text-deepBlack mb-6">Add New User</h2>

      <form onSubmit={handleCreateUser} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-akiliRed"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-akiliRed"
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-akiliRed"
        />

        <select
          value={formData.role}
          onChange={(e) =>
            setFormData({ ...formData, role: e.target.value })
          }
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-akiliRed
            text-deepBlack"
        >
          {currentUser?.publicMetadata?.role === "admin" && !currentUser?.publicMetadata?.tenantId && (
            <option
              value="admin"
              className="hover:bg-deepBlack hover:text-white"
            >
              Admin
            </option>
          )}
          <option
            value="teacher"
            className="hover:bg-deepBlack hover:text-white"
          >
            Teacher
          </option>
          <option
            value="student"
            className="hover:bg-deepBlack hover:text-white"
          >
            Student
          </option>
          <option
            value="security"
            className="hover:bg-deepBlack hover:text-white"
          >
            Security
          </option>
        </select>

        {currentUser?.publicMetadata?.role === "admin" && !currentUser?.publicMetadata?.tenantId && (
          <select
            value={formData.tenantId}
            onChange={(e) =>
              setFormData({ ...formData, tenantId: e.target.value })
            }
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-akiliRed text-deepBlack"
          >
            <option value="">Select Tenant</option>
            {tenants.map((tenant) => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.name}
              </option>
            ))}
          </select>
        )}

        <button
          type="submit"
          className="w-full bg-akiliRed text-white py-2 rounded-lg shadow hover:opacity-90 transition"
        >
          Create User
        </button>
      </form>
    </div>
  </div>
)}

    </div>
  );
}
