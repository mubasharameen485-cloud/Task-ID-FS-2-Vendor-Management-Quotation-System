'use client';
import { useState } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

export default function QuotationManager() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  // Fetch Vendors for Dropdown
  const { data: vendors = [] } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:5000/api/vendors');
      return res.data.data;
    }
  });

  // Fetch Quotations
  const { data: quotations = [], isLoading } = useQuery({
    queryKey: ['quotations'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:5000/api/quotations');
      return res.data.data;
    }
  });

  // Create Quotation Mutation
  const createMutation = useMutation({
    mutationFn: async (data) => await axios.post('http://localhost:5000/api/quotations', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['quotations']);
      reset();
      alert('Quotation Assigned Successfully!');
    }
  });

  // Update Status Mutation
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => await axios.patch(`http://localhost:5000/api/quotations/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries(['quotations'])
  });

  const onSubmit = (data) => createMutation.mutate(data);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Quotation Management</h1>

      {/* Add Quotation Form */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Request New Quotation</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input {...register('quotationTitle', { required: true })} placeholder="Quotation Title (e.g. 10 Laptops)" className="border p-2 rounded" />
          
          <select {...register('vendor', { required: true })} className="border p-2 rounded bg-white">
            <option value="">-- Select Vendor to Assign --</option>
            {vendors.map(v => (
              <option key={v._id} value={v._id}>{v.vendorName} ({v.companyName})</option>
            ))}
          </select>

          <input {...register('quotationAmount', { required: true })} type="number" placeholder="Proposed Amount ($)" className="border p-2 rounded" />
          <input {...register('description', { required: true })} placeholder="Details / Requirements" className="border p-2 rounded" />
          
          <button type="submit" disabled={createMutation.isPending} className="md:col-span-2 bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700">
            {createMutation.isPending ? 'Assigning...' : 'Assign Quotation'}
          </button>
        </form>
      </div>

      {/* Quotation List */}
      <div className="bg-white rounded-xl shadow-md border overflow-hidden">
        {isLoading ? <p className="p-8 text-center">Loading Quotations...</p> : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
              <tr>
                <th className="p-4">Quotation Details</th>
                <th className="p-4">Assigned Vendor</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map(q => (
                <tr key={q._id} className="border-b">
                  <td className="p-4">
                    <p className="font-bold text-gray-800">{q.quotationTitle}</p>
                    <p className="text-xs text-gray-500">{q.description}</p>
                  </td>
                  <td className="p-4 font-semibold text-blue-600">{q.vendor?.vendorName}</td>
                  <td className="p-4 font-bold text-green-600">${q.quotationAmount}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${q.status === 'Approved' ? 'bg-green-100 text-green-700' : q.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="p-4 space-x-2">
                    {q.status === 'Pending' && (
                      <>
                        <button onClick={() => statusMutation.mutate({ id: q._id, status: 'Approved' })} className="text-xs bg-green-500 text-white px-2 py-1 rounded">Approve</button>
                        <button onClick={() => statusMutation.mutate({ id: q._id, status: 'Rejected' })} className="text-xs bg-red-500 text-white px-2 py-1 rounded">Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}