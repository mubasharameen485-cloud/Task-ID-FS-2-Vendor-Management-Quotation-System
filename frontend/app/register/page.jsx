'use client';
import { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // By default hum naye user ko 'USER' role de rahay hain.
      // Agar Admin banana ho, toh Postman se banayen ya yahan dropdown de dein.
      await axios.post('http://localhost:5000/api/auth/register', { ...data, role: 'USER' });
      alert('Registration Successful! Please login.');
      router.push('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="bg-white p-8 rounded-xl shadow-md border w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Full Name</label>
            <input 
              {...register('name', { required: 'Name is required' })} 
              className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400" 
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Email Address</label>
            <input 
              type="email"
              {...register('email', { required: 'Email is required' })} 
              className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400" 
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Password</label>
            <input 
              type="password"
              {...register('password', { required: 'Password is required', minLength: 6 })} 
              className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400" 
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">Password must be at least 6 characters</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account? <Link href="/login" className="text-blue-600 hover:underline font-bold">Login here</Link>
        </p>
      </div>
    </div>
  );
}