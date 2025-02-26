import LoginPage from './auth/login-page';
import ForgottenPasswordPage from './auth/forgotten-password-page';
import RegisterPage from './auth/register-page';
import { ProjectConfig } from '@/lib/types';
import { Toaster } from '@/components/ui/sonner';
import { CMS_BASE_PATH, PAGES } from '@/lib/constants';
import UpdatePasswordPage from './auth/update-password';
import PageNotFound from './error-pages/page-not-found';
import Builder from './builder';
import React, { useEffect } from 'react';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import { useAuthState } from '@/lib/states/useAuthState';
import PageContent from './page-content';
import { TooltipProvider } from '../ui/tooltip';
import GlobalEditContent from './global-edit-content';
import PagePreview from './page-preview';
import { fetchProjectConfig, matchSlug } from '@/lib/utils';
import { Loader } from 'lucide-react';

const router: {
  slug: string;
  element: React.ComponentType<any>;
}[] = [
  {
    slug: PAGES.LOGIN,
    element: LoginPage,
  },
  {
    slug: PAGES.FORGOTTEN_PASSWORD,
    element: ForgottenPasswordPage,
  },
  {
    slug: PAGES.REGISTER,
    element: RegisterPage,
  },
  {
    slug: PAGES.UPDATE_PASSWORD,
    element: UpdatePasswordPage,
  },
  {
    slug: PAGES.PAGE_NOT_FOUND,
    element: PageNotFound,
  },
  {
    slug: CMS_BASE_PATH,
    element: LoginPage,
  },
  {
    slug: PAGES.BUILDER,
    element: Builder,
  },
  {
    slug: PAGES.PAGE_CONTENT,
    element: PageContent,
  },
  {
    slug: PAGES.GLOBAL_BLOCK_EDIT_CONTENT,
    element: GlobalEditContent,
  },
  {
    slug: `${PAGES.PREVIEW_PAGE}/:id`,
    element: PagePreview,
  },
];

export default function Cms(props: ProjectConfig & { path: string }) {
  const { setConfiguration, supabaseProjectUrl, supabaseAnonKey, projectId } = useProjectConfigurationState();
  const { fetchUser, fetchingUser } = useAuthState();
  useEffect(() => {
    if (props) {
      setConfiguration(props);
    }
    (async () => {
      fetchProjectConfig();
      fetchUser();
    })();
  }, [props, setConfiguration, fetchUser]);

  if (!supabaseProjectUrl.length && !supabaseAnonKey.length && !projectId) return null;
  if (fetchingUser)
    return (
      <div className="visio-cms-w-full visio-cms-bg-dark-900  visio-cms-h-[100vh] visio-cms-grid visio-cms-place-items-center">
        <Loader className="visio-cms-animate-spin" color="white" />
      </div>
    );

  const foundPage = matchSlug(props.path, router);

  return (
    <TooltipProvider>
      {foundPage ? <>{React.createElement(foundPage.page.element, { ...foundPage.params })}</> : <PageNotFound />}
      <Toaster />
    </TooltipProvider>
  );
}
