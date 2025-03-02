import VisioLogo from '@/components/ui/visio-logo';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import UserAvatar from './user-avatar';
import Share from './share';
import { PAGES } from '@/lib/constants';
import { ExternalLink } from 'lucide-react';
import SaveButton from './save-button';
import { useTabState } from '@/lib/states/useTabsState';

export default function Navbar() {
  const {tabs} = useTabState();
 const activeTab = tabs.find((tab) => tab.active);
  return (
    <div className="visio-cms-px-8  visio-cms-z-30 visio-cms-animate-slide-from-top visio-cms-fixed visio-cms-top-0 visio-cms-left-0 visio-cms-w-full visio-cms-bg-dark-700 visio-cms-flex visio-cms-justify-between">
      <VisioLogo className="visio-cms-my-1" />

      <div className="visio-cms-justify-between visio-cms-flex visio-cms-gap-2">
        <UserAvatar />
        <Separator orientation="vertical" className="visio-cms-bg-dark-900" />
        <Share />
        {tabs.length > 0 && (
         <>
         {activeTab?.type == 'page' && (
           <a target="_blank" href={`${PAGES.PREVIEW_PAGE}/${activeTab.id}`}>
           <Button className="visio-cms-my-2 visio-cms-flex visio-cms-items-center" variant={'ghost'}>
             Preview
             <ExternalLink size={13} className="visio-cms-ml-2" />
           </Button>
         </a>
         )}

        <Separator orientation="vertical" className="visio-cms-bg-dark-900" />
        <SaveButton />
        </>
        )}
       
      </div>
    </div>
  );
}
