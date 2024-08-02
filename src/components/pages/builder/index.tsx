import Navbar from '@/components/layout/nav-bar';
import SmallerScreenWarning from '../error-pages/smaller-screen-warning-page';
import LeftSideBar from '@/components/layout/left-side-bar';
import RightSideBar from '@/components/layout/right-side-bar';
import PageTabs from '@/components/layout/page-tabs';
import Canvas from '@/components/layout/canvas';
import { useAuthState } from '@/lib/states/useAuthState';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PAGES } from '@/lib/constants';

export default function Builder() {
  const { user } = useAuthState();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate(PAGES.LOGIN);
    }
  }, [user]);
  return (
    <>
      <SmallerScreenWarning />
      <div className="visio-cms-bg-dark-900 visio-cms-hidden lg:visio-cms-block visio-cms-text-white visio-cms-text-xs visio-cms-h-screen">
        <Navbar />
        <div className="visio-cms-flex">
          <div className="visio-cms-w-60 visio-cms-shrink-0">
            <LeftSideBar />
          </div>
          <div className="visio-cms-flex-1 visio-cms-max-w-[calc(100vw-480px)] visio-cms-mx-auto">
            <div className="visio-cms-pt-[42px] visio-cms-animate-fade-in">
              <PageTabs />
              <Canvas />
            </div>
          </div>
          <div className="visio-cms-w-60 visio-cms-shrink-0">
            <RightSideBar />
          </div>
        </div>
      </div>
    </>
  );
}
