import { RouterProvider } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { useEffect } from 'react';
import { CapacitorUpdater } from '@capgo/capacitor-updater';

export default function App() {
  useEffect(() => {
    // Notify CapGo that the app is loaded and ready
    // This prevents the app from rolling back to the previous version
    CapacitorUpdater.notifyAppReady();
  }, []);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}
