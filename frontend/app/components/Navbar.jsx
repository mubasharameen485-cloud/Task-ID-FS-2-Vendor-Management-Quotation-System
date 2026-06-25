'use client';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from 'next-themes'; 
import { Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const { user, logoutContext } = useContext(AuthContext);
  const { theme, setTheme, resolvedTheme } = useTheme(); 
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <nav className="p-4 h-16 bg-white dark:bg-gray-900"></nav>;

  return (
    <nav className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-4 shadow-md sticky top-0 z-50 transition-colors border-b dark:border-gray-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">Teyzix Vendor System</Link>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex space-x-6 font-medium">
            <Link href="/" className="hover:text-blue-500 transition">Dashboard</Link>
            <Link href="/vendors" className="hover:text-blue-500 transition">Vendors</Link>
            <Link href="/quotations" className="hover:text-blue-500 transition">Quotations</Link>
            <Link href="/compare" className="hover:text-blue-500 transition">Compare</Link>
          </div>
          
          {/* THEME TOGGLE */}
          <button 
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')} 
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition border dark:border-gray-600"
          >
            {resolvedTheme === 'dark' ? <Sun className="text-yellow-400" size={20} /> : <Moon className="text-gray-600" size={20} />}
          </button>

          {user ? (
            <div className="flex items-center gap-4 border-l border-gray-300 dark:border-gray-700 pl-6">
              <span className="text-sm font-bold">Hi, {user.name}</span>
              <button onClick={logoutContext} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:scale-105 transition">Logout</button>
            </div>
          ) : (
            <Link href="/login" className="text-blue-600 dark:text-blue-400 font-bold border border-blue-600 p-2 rounded">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}