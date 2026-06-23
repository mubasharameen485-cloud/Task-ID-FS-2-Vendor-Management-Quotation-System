'use client';
import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logoutContext } = useContext(AuthContext);

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-400">Teyzix Vendor System</Link>
        
        <div className="space-x-6 font-medium flex items-center">
          <Link href="/" className="hover:text-blue-300 transition">Dashboard</Link>
          <Link href="/vendors" className="hover:text-blue-300 transition">Vendors</Link>
          <Link href="/quotations" className="hover:text-blue-300 transition">Quotations</Link>
          <Link href="/compare" className="hover:text-blue-300 transition">Compare</Link>
          
          {user ? (
            <div className="flex items-center gap-4 border-l border-gray-700 pl-6">
              <span className="text-sm text-gray-300">Hi, {user.name}</span>
              {user.role === 'ADMIN' && (
                <Link href="/admin" className="text-red-400 font-bold hover:underline">Admin Panel</Link>
              )}
              <button onClick={logoutContext} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition">Logout</button>
            </div>
          ) : (
            <div className="border-l border-gray-700 pl-6 space-x-4">
              <Link href="/login" className="text-blue-400 hover:underline">Login</Link>
              {/* Aap chahay to register ka page khud bana sakte hain login ki tarha */}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}