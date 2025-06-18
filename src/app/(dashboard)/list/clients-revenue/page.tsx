'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const dummyClients = [
  { name: 'Acme Corp', plan: 'Pro', status: 'Active', revenue: 1200, nextInvoice: 'July 5, 2025', lastLogin: 'June 15, 2025' },
  { name: 'Globex Ltd', plan: 'Basic', status: 'Inactive', revenue: 300, nextInvoice: 'N/A', lastLogin: 'May 30, 2025' },
  { name: 'Soylent Co', plan: 'Enterprise', status: 'Active', revenue: 4800, nextInvoice: 'July 10, 2025', lastLogin: 'June 16, 2025' },
  { name: 'Initech', plan: 'Pro', status: 'Active', revenue: 1500, nextInvoice: 'July 7, 2025', lastLogin: 'June 14, 2025' },
];

const dummyRevenueData = [
  { month: 'Jan', revenue: 8000 },
  { month: 'Feb', revenue: 9200 },
  { month: 'Mar', revenue: 8700 },
  { month: 'Apr', revenue: 10500 },
  { month: 'May', revenue: 11200 },
  { month: 'Jun', revenue: 9800 },
];

export default function ClientsRevenuePage() {
  return (
    <div className="min-h-screen bg-pureWhite p-8">
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-6 text-deepBlack">Clients & Revenue Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        <SummaryCard title="Total Clients" value="128" />
        <SummaryCard title="Monthly Revenue" value="Ksh 23,480" />
        <SummaryCard title="Pending Payments" value="Ksh 1,240" />
        <SummaryCard title="Active Subscriptions" value="112" />
        <SummaryCard title="Avg Payment Time" value="9 Days" />
      </div>

      {/* Clients Table */}
      <div className="bg-white p-6 rounded-xl shadow mb-8 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-deepBlack">Clients</h2>
        <table className="w-full text-sm text-left">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="py-2">Client</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Revenue</th>
              <th>Next Invoice</th>
              <th>Last Login</th>
            </tr>
          </thead>
          <tbody>
            {dummyClients.map((client, index) => (
              <tr key={index} className="border-b">
                <td className="py-3">{client.name}</td>
                <td>{client.plan}</td>
                <td>
                  <span className={`font-medium ${client.status === 'Active' ? 'text-green-600' : 'text-akiliRed'}`}>
                    {client.status}
                  </span>
                </td>
                <td>Ksh {client.revenue}</td>
                <td>{client.nextInvoice}</td>
                <td>{client.lastLogin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-deepBlack">Revenue Trends</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dummyRevenueData}>
              <XAxis dataKey="month" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip />
              <Bar dataKey="revenue" fill="#E30613" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickLinkCard title="View All Invoices" />
        <QuickLinkCard title="Manage Plans" />
        <QuickLinkCard title="Add New Client" />
        <QuickLinkCard title="Export Reports" />
      </div>
    </div>
  );
}

/* Components */
function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-col justify-between border border-gray-100">
      <div className="text-sm text-gray-500 mb-2">{title}</div>
      <div className="text-2xl font-bold text-akiliRed">{value}</div>
    </div>
  );
}

function QuickLinkCard({ title }: { title: string }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow text-center cursor-pointer hover:border-akiliRed hover:border-2 transition">
      <div className="text-akiliRed font-semibold">{title}</div>
    </div>
  );
}
