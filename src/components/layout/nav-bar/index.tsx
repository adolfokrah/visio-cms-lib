import VisioLogo from '../../ui/visio-logo';
import { Separator } from '../../ui/separator';
import { Button } from '../../ui/button';
import UserAvatar from './user-avatar';
import Share from './share';
import { usePagesState } from '@/lib/states/usePagesState';
import { PAGES } from '@/lib/constants';
import { ExternalLink } from 'lucide-react';
import SaveButton from './save-button';

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
          <a target="_blank" href={`${PAGES.PREVIEW_PAGE}/${activePage.id}`}>
            <Button className="visio-cms-my-2 visio-cms-flex visio-cms-items-center" variant={'ghost'}>
            Preview
            <ExternalLink size={13} className='visio-cms-ml-2' />
            </Button>
          </a>
        )}
        <Separator orientation="vertical" className="visio-cms-bg-dark-900" />
        <SaveButton/>
      </div>
    </div>
  );
}
