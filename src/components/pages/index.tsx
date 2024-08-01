import LoginPage from './auth/login-page';
import ForgottenPasswordPage from './auth/forgotten-password-page';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RegisterPage from './auth/register-page';
import { ProjectConfigurationContext } from '@/lib/contexts/project-config-context';
import { ProjectConfiguration } from '@/lib/types';
import { Toaster } from '@/components/ui/sonner';
import { PAGES } from '@/lib/constants';
import UpdatePasswordPage from './auth/update-password';
import PageNotFound from './error-pages/page-not-found';

const router = createBrowserRouter([
  {
    path: PAGES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: PAGES.FORGOTTEN_PASSWORD,
    element: <ForgottenPasswordPage />,
  },
  {
    path: PAGES.REGISTER,
    element: <RegisterPage />,
  },
  {
    path: PAGES.UPDATE_PASSWORD,
    element: <UpdatePasswordPage />,
  },
  {
    path: PAGES.PAGE_NOT_FOUND,
    element: <PageNotFound />,
  },
  {
    path: '/cms/',
    element: <LoginPage />,
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
