import LoginPage from './auth/login-page';
import ForgottenPasswordPage from './auth/forgotten-password-page';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RegisterPage from './auth/register-page';
import { ProjectConfiguration } from '@/lib/types';
import { Toaster } from '@/components/ui/sonner';
import { CMS_BASE_PATH, PAGES } from '@/lib/constants';
import UpdatePasswordPage from './auth/update-password';
import PageNotFound from './error-pages/page-not-found';
import Builder from './builder';
import { useEffect } from 'react';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import { useAuthState } from '@/lib/states/useAuthState';

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
    path: CMS_BASE_PATH,
    element: <LoginPage />,
  },
  {
    path: PAGES.BUILDER,
    element: <Builder />,
  },
]);

export default function Auth(projectConfiguration: ProjectConfiguration) {
  const { setConfiguration, supabaseProjectUrl, supabaseAnonKey } = useProjectConfigurationState();
  const { fetchUser } = useAuthState();
  useEffect(() => {
    setConfiguration(projectConfiguration);
    fetchUser();
  }, [projectConfiguration, setConfiguration, fetchUser]);

  if (!supabaseProjectUrl.length && !supabaseAnonKey.length) return null;

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
