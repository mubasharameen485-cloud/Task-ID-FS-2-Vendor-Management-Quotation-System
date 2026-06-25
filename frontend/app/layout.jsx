import './globals.css';
import Providers from './providers';
import { AuthProvider } from '../context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col min-h-screen transition-colors duration-300">
        <Providers>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 p-6">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}