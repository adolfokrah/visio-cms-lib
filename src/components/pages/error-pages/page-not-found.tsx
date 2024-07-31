import { Button } from '@/components/ui/button';
import { PAGES } from '@/lib/constants';
import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <div className="visio-cms-bg-dark-900 visio-cms-overflow-hidden visio-cms-px-3 visio-cms-text-white visio-cms-text-xs visio-cms-h-screen visio-cms-flex visio-cms-items-center visio-cms-place-content-center">
      <h3 className="visio-cms-text-[10rem] md:visio-cms-text-[15rem] lg:visio-cms-text-[30rem]  xlg:visio-cms-text-[30rem] visio-cms-font-extrabold visio-cms-text-dark-800 visio-cms-absolute">
        404
      </h3>

      <div className="visio-cms-text-center visio-cms-space-y-4 visio-cms-relative">
        <h3 className="visio-cms-text-4xl visio-cms-text-gray-500">👀</h3>
        <p>We couldn't find the page you are looking for</p>
        <Link to={PAGES.LOGIN}>
          <Button className="visio-cms-mt-4">Go back home</Button>
        </Link>
      </div>
    </div>
  );
}
