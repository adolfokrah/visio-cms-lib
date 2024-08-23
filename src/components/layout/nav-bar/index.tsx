import VisioLogo from '../../ui/visio-logo';
import { Separator } from '../../ui/separator';
import { Button } from '../../ui/button';
import UserAvatar from './user-avatar';
import Share from './share';
import { usePagesState } from '@/lib/states/usePagesState';
import { Link } from 'react-router-dom';
import { PAGES } from '@/lib/constants';

export default function Navbar() {
  const { pages } = usePagesState();
  const activePage = pages.find((page) => page.active);

  return (
    <div className="visio-cms-px-8  visio-cms-z-30 visio-cms-animate-slide-from-top visio-cms-fixed visio-cms-top-0 visio-cms-left-0 visio-cms-w-full visio-cms-bg-dark-700 visio-cms-flex visio-cms-justify-between">
      <VisioLogo className="visio-cms-my-1" />

      <div className="visio-cms-justify-between visio-cms-flex visio-cms-gap-2">
        <UserAvatar />
        <Separator orientation="vertical" className="visio-cms-bg-dark-900" />
        <Share />
        {activePage && (
          <Link target="_blank" to={`${PAGES.PREVIEW_PAGE}/${activePage.id}`}>
            <Button className="visio-cms-my-2">Preview</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
