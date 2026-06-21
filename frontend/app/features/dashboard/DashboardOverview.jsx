'use client';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Users, FileText, Clock, CheckCircle, Activity } from 'lucide-react';

export default function DashboardOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:5000/api/dashboard/stats');
      return res.data.data;
    }
  });

  if (isLoading) return <div className="p-10 text-center animate-pulse font-bold text-gray-500">Loading Dashboard...</div>;

  const { stats, recentActivities } = data || {};

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 border-b pb-2">System Dashboard</h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Users size={28} /></div>
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase">Total Vendors</p>
            <p className="text-3xl font-black text-gray-800">{stats?.totalVendors || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-indigo-500 flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-full text-indigo-600"><FileText size={28} /></div>
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase">Active Quotations</p>
            <p className="text-3xl font-black text-gray-800">{stats?.activeQuotations || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500 flex items-center gap-4">
          <div className="bg-yellow-100 p-3 rounded-full text-yellow-600"><Clock size={28} /></div>
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase">Pending Quotations</p>
            <p className="text-3xl font-black text-gray-800">{stats?.pendingQuotations || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full text-green-600"><CheckCircle size={28} /></div>
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase">Approved Quotations</p>
            <p className="text-3xl font-black text-gray-800">{stats?.approvedQuotations || 0}</p>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITIES TIMELINE */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Activity className="text-blue-500" /> Recent Activities
        </h2>
        
        <div className="space-y-4">
          {recentActivities?.length > 0 ? recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
              <div className={`mt-1 h-3 w-3 rounded-full ${activity.type === 'Vendor' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
              <div>
                <p className="text-gray-800 font-medium">{activity.message}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(activity.date).toLocaleString()}</p>
              </div>
            </div>
          )) : (
            <p className="text-gray-500 italic">No recent activities found.</p>
          )}
        </div>
      </div>
    </div>
  );
}