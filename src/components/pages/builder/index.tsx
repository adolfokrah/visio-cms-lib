import Navbar from '@/components/layout/nav-bar';
import SmallerScreenWarning from '../error-pages/smaller-screen-warning-page';
import LeftSideBar from '@/components/layout/left-side-bar';
import RightSideBar from '@/components/layout/right-side-bar';
import Canvas from '@/components/layout/canvas';

export default function Builder() {
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
            <Canvas />
          </div>
          <div className="visio-cms-w-60 visio-cms-shrink-0">
            <RightSideBar />
          </div>
        </div>
      </div>
    </>
  );
}
