'use client';
import { useContext } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);

  const { data, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:5000/api/dashboard/stats');
      return res.data.data;
    }
  });

  // Authorization Check
  if (!user || user.role !== 'ADMIN') {
    return <div className="p-10 text-center text-red-500 font-bold text-2xl">Access Denied! Admins Only.</div>;
  }

  if (isLoading) return <div className="p-10 text-center">Loading Admin Panel...</div>;

  const { stats, usersList } = data || {};

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Admin Control Panel</h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500">
          <h3 className="text-gray-500 font-bold">Total Registered Users</h3>
          <p className="text-4xl font-black text-blue-600">{stats?.totalUsers || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-500">
          <h3 className="text-gray-500 font-bold">Total Vendors</h3>
          <p className="text-4xl font-black text-green-600">{stats?.totalVendors || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-purple-500">
          <h3 className="text-gray-500 font-bold">Total Quotations</h3>
          <p className="text-4xl font-black text-purple-600">{stats?.totalQuotations || 0}</p>
        </div>
      </div>

      {/* REGISTERED USERS TABLE */}
      <div className="bg-white rounded-xl shadow-md border overflow-hidden">
        <h2 className="bg-gray-100 p-4 font-bold text-gray-700">All Registered Users</h2>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email Address</th>
              <th className="p-4">Role</th>
              <th className="p-4">Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {usersList?.map(u => (
              <tr key={u._id} className="border-t">
                <td className="p-4 font-bold">{u.name}</td>
                <td className="p-4 text-gray-600">{u.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-gray-500 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}