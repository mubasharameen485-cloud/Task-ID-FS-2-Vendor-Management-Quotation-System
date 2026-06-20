import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-400">
          Teyzix Vendor System
        </Link>
        <div className="space-x-6 font-medium">
          <Link href="/" className="hover:text-blue-300 transition">Vendors</Link>
          <Link href="/quotations" className="hover:text-blue-300 transition">Quotations</Link>
        </div>
      </div>
    </nav>
  );
}