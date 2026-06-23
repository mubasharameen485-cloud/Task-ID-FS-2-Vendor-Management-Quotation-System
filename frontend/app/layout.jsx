import './globals.css';
import Providers from './providers';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from '../context/AuthContext';
export const metadata = {
  title: 'Vendor Management System',
  description: 'Teyzix FS-2 Task',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 flex flex-col min-h-screen">
        <Providers>
  <AuthProvider> {/* Wrapper add karein */}
    <Navbar />
    <main className="flex-1 p-6">{children}</main>
    <Footer />
  </AuthProvider>
</Providers>
      </body>
    </html>
  );
}