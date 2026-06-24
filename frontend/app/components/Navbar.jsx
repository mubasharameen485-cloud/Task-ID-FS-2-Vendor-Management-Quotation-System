'use client';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from 'next-themes'; // Official hook
import { Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const { user, logoutContext } = useContext(AuthContext);
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Next.js Hydration Mismatch se bachne ke liye
  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <nav className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-4 shadow-md sticky top-0 z-50 transition-colors duration-300 border-b dark:border-gray-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">Teyzix Vendor System</Link>
        
        <div className="space-x-6 font-medium flex items-center">
          <Link href="/" className="hover:text-blue-500 transition">Dashboard</Link>
          <Link href="/vendors" className="hover:text-blue-500 transition">Vendors</Link>
          <Link href="/quotations" className="hover:text-blue-500 transition">Quotations</Link>
          <Link href="/compare" className="hover:text-blue-500 transition">Compare</Link>
          
          {/* DARK MODE TOGGLE BUTTON */}
          {mounted && (
            <button 
              onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')} 
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {currentTheme === 'dark' ? <Sun className="text-yellow-400" size={20} /> : <Moon className="text-gray-600" size={20} />}
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-4 border-l border-gray-300 dark:border-gray-700 pl-6">
              <span className="text-sm">Hi, {user.name}</span>
              {user.role === 'ADMIN' && (
                <Link href="/admin" className="text-red-500 font-bold hover:underline">Admin</Link>
              )}
              <button onClick={logoutContext} className="bg-red-500 text-white hover:bg-red-600 px-3 py-1 rounded text-sm transition">Logout</button>
            </div>
          ) : (
            <div className="border-l border-gray-300 dark:border-gray-700 pl-6 space-x-4">
              <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">Login</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}