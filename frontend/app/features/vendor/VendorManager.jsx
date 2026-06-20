'use client';
import { useState } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Trash2, Edit, X, Search, Filter } from 'lucide-react';

export default function VendorManager() {
  const queryClient = useQueryClient();
  
  // States for Search, Filter, and Edit Modal
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // Filter/Sort state
  const [editingVendor, setEditingVendor] = useState(null); // Holds the vendor being edited
  
  // React Hook Form for Add Vendor
  const { register, handleSubmit, reset } = useForm();
  
  // React Hook Form for Edit Vendor
  const { register: registerEdit, handleSubmit: handleEditSubmit, reset: resetEdit } = useForm();

  // 1. FETCH VENDORS (TanStack Query)
  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ['vendors', searchTerm], 
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/api/vendors?search=${searchTerm}`);
      return res.data.data;
    }
  });

  // Apply Frontend Sorting/Filtering
  const filteredAndSortedVendors = [...vendors].sort((a, b) => {
    if (sortOrder === 'a-z') return a.vendorName.localeCompare(b.vendorName);
    if (sortOrder === 'z-a') return b.vendorName.localeCompare(a.vendorName);
    return 0; // Default is newest (handled by backend createdAt: -1)
  });

  // 2. CREATE VENDOR MUTATION
  const createMutation = useMutation({
    mutationFn: async (newVendor) => await axios.post('http://localhost:5000/api/vendors', newVendor),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendors']); 
      reset(); 
      alert('Vendor Added Successfully!');
    }
  });

  // 3. UPDATE VENDOR MUTATION
  const updateMutation = useMutation({
    mutationFn: async ({ id, updateData }) => await axios.put(`http://localhost:5000/api/vendors/${id}`, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendors']); 
      setEditingVendor(null); // Close Modal
      alert('Vendor Updated Successfully!');
    }
  });

  // 4. DELETE VENDOR MUTATION
  const deleteMutation = useMutation({
    mutationFn: async (id) => await axios.delete(`http://localhost:5000/api/vendors/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['vendors'])
  });

  // Handlers
  const onAddSubmit = (data) => createMutation.mutate(data);
  
  const onEditSubmit = (data) => {
    updateMutation.mutate({ id: editingVendor._id, updateData: data });
  };

  const openEditModal = (vendor) => {
    setEditingVendor(vendor);
    resetEdit(vendor); // Populate form with existing data
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 border-b pb-2">Vendor Management</h1>

      {/* --- ADD VENDOR SECTION --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold mb-4 text-blue-600">➕ Add New Vendor</h2>
        <form onSubmit={handleSubmit(onAddSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input {...register('vendorName', { required: true })} placeholder="Vendor Name *" className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none" />
          <input {...register('companyName', { required: true })} placeholder="Company Name *" className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none" />
          <input {...register('email', { required: true })} type="email" placeholder="Email Address *" className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none" />
          <input {...register('contactNumber', { required: true })} placeholder="Contact Number *" className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none" />
          <input {...register('businessAddress', { required: true })} placeholder="Business Address *" className="border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none" />
          
          <button 
            type="submit" 
            disabled={createMutation.isPending}
            className="lg:col-span-5 bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {createMutation.isPending ? 'Adding Vendor...' : 'Add Vendor'}
          </button>
        </form>
      </div>

      {/* --- SEARCH & FILTER SECTION --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search vendors by name or company..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="text-gray-500" size={20} />
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            className="border p-2 rounded-lg outline-none cursor-pointer focus:ring-2 focus:ring-blue-400"
          >
            <option value="newest">Sort by: Newest First</option>
            <option value="a-z">Sort by: Name (A-Z)</option>
            <option value="z-a">Sort by: Name (Z-A)</option>
          </select>
        </div>
      </div>

      {/* --- VENDORS LIST TABLE --- */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {isLoading ? (
          <p className="p-10 text-center text-gray-500 font-medium animate-pulse">Loading vendor directory...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-max">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider border-b">
                <tr>
                  <th className="p-4">Vendor Details</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Location</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredAndSortedVendors.length > 0 ? filteredAndSortedVendors.map((vendor) => (
                  <tr key={vendor._id} className="hover:bg-blue-50/50 transition">
                    <td className="p-4">
                      <p className="font-bold text-gray-800 text-sm">{vendor.vendorName}</p>
                      <p className="text-xs text-blue-600 font-semibold bg-blue-100 inline-block px-2 py-0.5 rounded-full mt-1">
                        {vendor.companyName}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-800">{vendor.email}</p>
                      <p className="text-xs text-gray-500 mt-1">📞 {vendor.contactNumber}</p>
                    </td>
                    <td className="p-4 text-sm text-gray-600 max-w-[200px] truncate" title={vendor.businessAddress}>
                      {vendor.businessAddress}
                    </td>
                    <td className="p-4 text-center space-x-3">
                      {/* EDIT BUTTON */}
                      <button 
                        onClick={() => openEditModal(vendor)}
                        className="text-blue-500 hover:text-blue-700 bg-blue-50 p-2 rounded-full transition"
                        title="Edit Vendor"
                      >
                        <Edit size={18} />
                      </button>
                      
                      {/* DELETE BUTTON */}
                      <button 
                        onClick={() => {
                          if(window.confirm('Are you sure you want to delete this vendor?')) {
                            deleteMutation.mutate(vendor._id);
                          }
                        }}
                        className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-full transition"
                        title="Delete Vendor"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-gray-400 italic">No vendors found matching your criteria.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- EDIT VENDOR MODAL --- */}
      {editingVendor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">Edit Vendor Information</h2>
              <button onClick={() => setEditingVendor(null)} className="hover:text-red-200 transition"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleEditSubmit(onEditSubmit)} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Vendor Name</label>
                <input {...registerEdit('vendorName', { required: true })} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Company Name</label>
                <input {...registerEdit('companyName', { required: true })} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                  <input {...registerEdit('email', { required: true })} type="email" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none bg-gray-100" readOnly title="Email cannot be changed easily" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Contact Number</label>
                  <input {...registerEdit('contactNumber', { required: true })} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Business Address</label>
                <textarea {...registerEdit('businessAddress', { required: true })} rows="2" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"></textarea>
              </div>
              
              <div className="flex gap-3 pt-4 border-t">
                <button type="button" onClick={() => setEditingVendor(null)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-2 rounded hover:bg-gray-200 transition">Cancel</button>
                <button type="submit" disabled={updateMutation.isPending} className="flex-1 bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 transition">
                  {updateMutation.isPending ? 'Saving Changes...' : 'Update Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}