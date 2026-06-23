'use client';
import { useState, useContext } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthContext } from '../../context/AuthContext'; // Apne path ke hisab se set karein

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { loginContext } = useContext(AuthContext); // Context API se function liya

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', data);
      const { user, token } = response.data;
      
      // Context mein data save karein (is se Navbar update ho jayega)
      loginContext(user, token);
      
      alert(`Welcome back, ${user.name}!`);
      
      // Agar Admin hai tou seedha Admin panel pe bheje, warna Dashboard pe
      if (user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="bg-white p-8 rounded-xl shadow-md border w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to Teyzix</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              {...register('password', { required: 'Password is required' })} 
              className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400" 
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account? <Link href="/register" className="text-blue-600 hover:underline font-bold">Register here</Link>
        </p>
      </div>
    </div>
  );
}