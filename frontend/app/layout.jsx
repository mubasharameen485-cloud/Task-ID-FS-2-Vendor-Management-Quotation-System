import './globals.css';
import Providers from './providers';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext'; // ThemeProvider Import
import Navbar from '../app/components/Navbar';
import Footer from '../app/components/Footer';

export const metadata = {
  title: 'Vendor Management System',
  description: 'Teyzix FS-2 Task',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Body par transition lagaya hai for smooth color change */}
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col min-h-screen transition-colors duration-300">
        <Providers>
          <AuthProvider>
            <ThemeProvider> {/* WRAP HERE */}
              <Navbar />
              <main className="flex-1 p-6">
                {children}
              </main>
              <Footer />
            </ThemeProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}