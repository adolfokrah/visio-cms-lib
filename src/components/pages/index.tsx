import LoginPage from './auth/login-page';
import ForgottenPasswordPage from './auth/forgotten-password-page';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RegisterPage from './auth/register-page';
import { ProjectConfigurationContext } from '@/lib/contexts/project-config-context';
import { ProjectConfiguration } from '@/lib/types';
import { Toaster } from '@/components/ui/sonner';

const router = createBrowserRouter([
  {
    path: '/cms/login',
    element: <LoginPage />,
  },
  {
    path: '/cms/forgotten-password',
    element: <ForgottenPasswordPage />,
  },
  {
    path: '/cms/register',
    element: <RegisterPage />,
  },
]);

export default function Auth({ supabaseProjectUrl, supabaseAnonKey }: ProjectConfiguration) {
  return (
    <ProjectConfigurationContext.Provider value={{ supabaseProjectUrl, supabaseAnonKey }}>
      <RouterProvider router={router} />
      <Toaster />
    </ProjectConfigurationContext.Provider>
  );
}
