// src/app/(dashboard)/settings/page.tsx

"use client";
import { useState } from "react";

const settingsSections = ["Account", "Users", "System", "Notifications", "Integrations"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Account");

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md border-r">
        <div className="p-6 font-bold text-xl border-b">Settings</div>
        <nav className="p-4 space-y-2">
          {settingsSections.map((section) => (
            <button
              key={section}
              onClick={() => setActiveTab(section)}
              className={`block w-full text-left px-4 py-2 rounded-lg transition ${
                activeTab === section ? "bg-black text-white" : "hover:bg-gray-100"
              }`}
            >
              {section}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">{activeTab} Settings</h2>
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          {activeTab === "Account" && (
            <>
              <label className="block">
                <span className="text-sm text-gray-700">Full Name</span>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">Email</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </label>
              <button className="bg-black text-white px-4 py-2 rounded-lg">Save Changes</button>
            </>
          )}

          {activeTab === "System" && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm">Enable dark mode</span>
                <input type="checkbox" className="toggle toggle-sm" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Maintenance Mode</span>
                <input type="checkbox" className="toggle toggle-sm" />
              </div>
            </>
          )}

          {activeTab === "Integrations" && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Clerk Authentication</span>
                  <button className="bg-gray-800 text-white px-3 py-1 rounded text-sm">Configure</button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">M-Pesa API</span>
                  <button className="bg-gray-800 text-white px-3 py-1 rounded text-sm">Connect</button>
                </div>
              </div>
            </>
          )}

          {activeTab === "Users" && (
            <div>
              <p className="text-gray-600 text-sm">Manage roles, access levels, and permissions here.</p>
              <button className="mt-4 bg-black text-white px-4 py-2 rounded-lg">Open User Roles</button>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div className="space-y-2">
              <label className="flex items-center justify-between">
                <span className="text-sm">Email Alerts</span>
                <input type="checkbox" className="toggle toggle-sm" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm">SMS Notifications</span>
                <input type="checkbox" className="toggle toggle-sm" />
              </label>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
