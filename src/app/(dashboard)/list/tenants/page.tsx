'use client';
import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Users, Building, Mail, Phone, MapPin, Filter, Download, MoreVertical, Loader2, Check } from 'lucide-react';
import AddTenantDialog from '@/components/CreateTenant'; // adjust path accordingly


// const mockTenants = [
//   {
//     id: "1",
//     name: "Acme Corporation",
//     code: "ACME001",
//     contact: "+1 (555) 123-4567",
//     address: "123 Business St, New York, NY 10001",
//     email: "admin@acme.corp",
//     status: "active",
//     usersCount: 45,
//     createdAt: "2024-01-15",
//     subscription: "enterprise"
//   },
//   {
//     id: "2",
//     name: "TechStart Inc",
//     code: "TECH002",
//     contact: "+1 (555) 987-6543",
//     address: "456 Innovation Ave, San Francisco, CA 94105",
//     email: "contact@techstart.inc",
//     status: "active",
//     usersCount: 12,
//     createdAt: "2024-02-20",
//     subscription: "professional"
//   },
//   {
//     id: "3",
//     name: "Global Solutions Ltd",
//     code: "GLBL003",
//     contact: "+1 (555) 456-7890",
//     address: "789 Enterprise Blvd, Chicago, IL 60601",
//     email: "info@globalsolutions.com",
//     status: "inactive",
//     usersCount: 28,
//     createdAt: "2023-11-10",
//     subscription: "basic"
//   },
//   {
//     id: "4",
//     name: "Digital Dynamics",
//     code: "DIGI004",
//     contact: "+1 (555) 321-0987",
//     address: "321 Tech Park, Austin, TX 78701",
//     email: "hello@digitaldynamics.io",
//     status: "active",
//     usersCount: 67,
//     createdAt: "2024-03-05",
//     subscription: "enterprise"
//   }
// ];


const TenantManagementDashboard = () => {
  const [mockTenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await fetch('/api/tenant');
        const data = await res.json();
        setTenants(data);
      } catch (err) {
        console.error("Failed to fetch tenants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewTenant, setViewTenant] = useState<typeof mockTenants[number] | null>(null);
  const [editTenant, setEditTenant] = useState<typeof mockTenants[number] | null>(null);
  const [manageTenantUsers, setManageTenantUsers] = useState<typeof mockTenants[number] | null>(null);
  const [tenantToDelete, setTenantToDelete] = useState<typeof mockTenants[number] | null>(null);
  const handleAddTenant = async (formData: any) => {
    console.log('Tenant submitted:', formData);
    // TODO: Send to backend API
  };

  const handleViewDetails = (tenant: typeof mockTenants[number]) => {
    setViewTenant(tenant);
  };

  const handleEditTenant = (tenant: typeof mockTenants[number]) => {
    setEditTenant(tenant);
  };

  const handleManageUsers = (tenant: typeof mockTenants[number]) => {
    setManageTenantUsers(tenant);
  };

  const handleDeleteTenant = (tenant: typeof mockTenants[number]) => {
    setTenantToDelete(tenant);
  };
  const handleConfirmDelete = async () => {
    console.log('Deleting tenant:', tenantToDelete);
  };
  const [status, setStatus] = useState<"idle" | "exporting" | "done">("idle");

  const handleExport = () => {
    if (!mockTenants || mockTenants.length === 0) {
      alert("No tenant data to export.");
      return;
    }

    setStatus("exporting");

    // Simulate export process
    setTimeout(() => {
      const csvHeader = "Name,Email,Status,Subscription\n";
      const csvRows = mockTenants
        .map(t => `${t.name},${t.email},${t.status},${t.subscription}`)
        .join("\n");

      const csvContent = csvHeader + csvRows;
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `tenants_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setStatus("done");

      // Reset back to default after 3s
      setTimeout(() => setStatus("idle"), 3000);
    }, 1000); // simulate some processing delay
  };


  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subscriptionFilter, setSubscriptionFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  // const [selectedTenants, setSelectedTenants] = useState([]);
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);


  // Mock role - in real app this would come from auth
  const userRole = 'admin';

  const filteredTenants = mockTenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
    const matchesSubscription = subscriptionFilter === 'all' || tenant.subscription === subscriptionFilter;

    return matchesSearch && matchesStatus && matchesSubscription;
  });

  const handleSelectTenant = (tenantId: string) => {
    setSelectedTenants(prev =>
      prev.includes(tenantId)
        ? prev.filter(id => id !== tenantId)
        : [...prev, tenantId]
    );
  };

  type TenantStatus = 'active' | 'inactive' | 'pending';

  const getStatusBadge = (status: TenantStatus) => {
    const statusClasses: Record<TenantStatus, string> = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  type SubscriptionType = 'basic' | 'professional' | 'enterprise';

  const getSubscriptionBadge = (subscription: string) => {
    const subscriptionClasses: Record<SubscriptionType, string> = {
      basic: 'bg-gray-100 text-gray-800',
      professional: 'bg-blue-100 text-blue-800',
      enterprise: 'bg-purple-100 text-purple-800'
    };

    const validSubscription = (subscription: string): subscription is SubscriptionType =>
      ['basic', 'professional', 'enterprise'].includes(subscription);

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${validSubscription(subscription) ? subscriptionClasses[subscription] : 'bg-gray-100 text-gray-800'
        }`}>
        {subscription.charAt(0).toUpperCase() + subscription.slice(1)}
      </span>
    );
  };

  type ActionMenuProps = {
    tenant: typeof mockTenants[number];
    onView: (tenant: typeof mockTenants[number]) => void;
    onEdit: (tenant: typeof mockTenants[number]) => void;
    onManageUsers: (tenant: typeof mockTenants[number]) => void;
    onDelete: (tenant: typeof mockTenants[number]) => void;
  };

  const ActionMenu = ({
    tenant,
    onView,
    onEdit,
    onManageUsers,
    onDelete
  }: {
    tenant: typeof mockTenants[number];
    onView: (tenant: typeof mockTenants[number]) => void;
    onEdit: (tenant: typeof mockTenants[number]) => void;
    onManageUsers: (tenant: typeof mockTenants[number]) => void;
    onDelete: (tenant: typeof mockTenants[number]) => void;
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = (action: () => void) => {
      action();
      setIsOpen(false);
    };

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
            <div className="py-1">
              <button
                onClick={() => handleClick(() => onView(tenant))}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 w-full text-left"
              >
                <Eye className="w-4 h-4" /> View Details
              </button>
              <button
                onClick={() => handleClick(() => onEdit(tenant))}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 w-full text-left"
              >
                <Edit className="w-4 h-4" /> Edit Merchant
              </button>
              <button
                onClick={() => handleClick(() => onManageUsers(tenant))}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 w-full text-left"
              >
                <Users className="w-4 h-4" /> Manage Users
              </button>
              <div className="border-t my-1"></div>
              <button
                onClick={() => handleClick(() => onDelete(tenant))}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-red-50 text-red-600 w-full text-left"
              >
                <Trash2 className="w-4 h-4" /> Disable Merchant
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };


  const TenantCard = ({ tenant }: { tenant: typeof mockTenants[number] }) => (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-lg">
              {tenant.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{tenant.name}</h3>
              <p className="text-sm text-gray-500">{tenant.code}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(
              ['active', 'inactive', 'pending'].includes(tenant.status)
                ? (tenant.status as TenantStatus)
                : 'pending'
            )}
            {userRole === 'admin' && <ActionMenu tenant={tenant} onView={function (tenant: (typeof mockTenants)[number]): void {
              handleViewDetails(tenant);
            }} onEdit={function (tenant: (typeof mockTenants)[number]): void {
              handleEditTenant(tenant);
            }} onManageUsers={function (tenant: (typeof mockTenants)[number]): void {
              handleManageUsers(tenant);
            }} onDelete={function (tenant: (typeof mockTenants)[number]): void {
              handleDeleteTenant(tenant);
            }} />}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span>{tenant.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{tenant.contact}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{tenant.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{tenant.usersCount} users</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          {getSubscriptionBadge(tenant.subscription)}
          <span className="text-xs text-gray-500">
            Created: {new Date(tenant.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="w-full mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              {/* Heading */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Merchant Management</h1>
                <p className="text-gray-600 mt-1">Manage and monitor all AIOTA merchant/Clients</p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleExport}
                  disabled={status === "exporting"}
                  className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg transition-colors ${status === "exporting"
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "hover:bg-gray-50"
                    }`}
                >
                  {status === "exporting" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Exporting...
                    </>
                  ) : status === "done" ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      Downloaded
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Export
                    </>
                  )}
                </button>

                {userRole === 'admin' && (
                  <>
                    <button
                      onClick={() => setIsDialogOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Plus className="w-4 h-4" />
                      Add Merchant
                    </button>
                    <AddTenantDialog
                      isOpen={isDialogOpen}
                      onClose={() => setIsDialogOpen(false)}
                    />
                    

                  </>
                )}
              </div>
            </div>


            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Tenants</p>
                    <p className="text-2xl font-bold text-gray-900">{mockTenants.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Tenants</p>
                    <p className="text-2xl font-bold text-green-600">{mockTenants.filter(t => t.status === 'active').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-purple-600">{mockTenants.reduce((sum, t) => sum + t.usersCount, 0)}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Enterprise Plans</p>
                    <p className="text-2xl font-bold text-orange-600">{mockTenants.filter(t => t.subscription === 'enterprise').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            {/* Filters and Search */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
              <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                {/* Search Bar */}
                <div className="flex-1 w-full">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search tenants by name, code, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Filters + View Mode */}
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>

                  <select
                    value={subscriptionFilter}
                    onChange={(e) => setSubscriptionFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Plans</option>
                    <option value="basic">Basic</option>
                    <option value="professional">Professional</option>
                    <option value="enterprise">Enterprise</option>
                  </select>

                  {/* View mode toggle */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('table')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${viewMode === 'table'
                        ? 'bg-white shadow-sm text-gray-900'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      Table
                    </button>
                    <button
                      onClick={() => setViewMode('cards')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${viewMode === 'cards'
                        ? 'bg-white shadow-sm text-gray-900'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      Cards
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Content */}
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTenants.map(tenant => (
                <TenantCard key={tenant.id} tenant={tenant} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Tenant</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 hidden md:table-cell">Address</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Plan</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Users</th>
                      {userRole === 'admin' && <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTenants.map(tenant => (
                      <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                              {tenant.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{tenant.name}</div>
                              <div className="text-sm text-gray-500">{tenant.code}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-900">{tenant.email}</div>
                          <div className="text-sm text-gray-500">{tenant.contact}</div>
                        </td>
                        <td className="py-4 px-4 hidden md:table-cell">
                          <div className="text-sm text-gray-900 max-w-xs truncate">{tenant.address}</div>
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(
                            ['active', 'inactive', 'pending'].includes(tenant.status)
                              ? (tenant.status as TenantStatus)
                              : 'pending'
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {getSubscriptionBadge(tenant.subscription)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-900">{tenant.usersCount}</div>
                        </td>
                        {userRole === 'admin' && (
                          <td className="py-4 px-4">
                            <ActionMenu
                              tenant={tenant}
                              onView={handleViewDetails}
                              onEdit={handleEditTenant}
                              onManageUsers={handleManageUsers}
                              onDelete={handleDeleteTenant}
                            />
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 px-4">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTenants.length}</span> of{' '}
              <span className="font-medium">{filteredTenants.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">
                1
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      {viewTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Tenant Details</h2>
            <>
              <p><strong>Name:</strong> {viewTenant.name}</p>
              <p><strong>Email:</strong> {viewTenant.email}</p>
              <p><strong>Phone:</strong> {viewTenant.contact}</p>
              <p><strong>Address:</strong> {viewTenant.address}</p>
              <p><strong>Status:</strong> {viewTenant.status}</p>
              <p><strong>Plan:</strong> {viewTenant.subscription}</p>
            </>
            <div className="text-right mt-4">
              <button onClick={() => setViewTenant(null)} className="px-4 py-2 bg-gray-200 rounded">Close</button>
            </div>
          </div>
        </div>
      )}

      {editTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Tenant</h2>
            <p>This would be a form prefilled with {editTenant.name}</p>
            <div className="text-right mt-4 flex gap-2">
              <button onClick={() => setEditTenant(null)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button onClick={() => {
                console.log('Submit edit');
                setEditTenant(null);
              }} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      {manageTenantUsers && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Manage Users</h2>
            <p>Managing users for <strong>{manageTenantUsers.name}</strong></p>
            <div className="text-right mt-4">
              <button onClick={() => setManageTenantUsers(null)} className="px-4 py-2 bg-gray-200 rounded">Close</button>
            </div>
          </div>
        </div>
      )}

      {tenantToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-red-600">Delete Tenant</h2>
            <p>Are you sure you want to delete <strong>{tenantToDelete.name}</strong>?</p>
            <div className="text-right mt-4 flex gap-2">
              <button onClick={() => setTenantToDelete(null)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button onClick={() => {
                console.log('Deleting:', tenantToDelete.name);
                // TODO: Call delete API here
                setTenantToDelete(null);
              }} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};



export default TenantManagementDashboard;

function onClick(event: React.MouseEvent<HTMLButtonElement>): void {
  throw new Error('Function not implemented.');
}
