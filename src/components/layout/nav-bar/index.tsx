import VisioLogo from '../../ui/visio-logo';
import { Separator } from '../../ui/separator';
import { Button } from '../../ui/button';
import UserAvatar from './user-avatar';
import Share from './share';

export default function Navbar() {
  return (
    <div className="visio-cms-px-8  visio-cms-z-30 visio-cms-animate-slide-from-top visio-cms-fixed visio-cms-top-0 visio-cms-left-0 visio-cms-w-full visio-cms-bg-dark-700 visio-cms-flex visio-cms-justify-between">
      <VisioLogo className="visio-cms-my-1" />

      <div className="visio-cms-justify-between visio-cms-flex visio-cms-gap-2">
        <UserAvatar />
        <Separator orientation="vertical" className="visio-cms-bg-dark-900" />
        <Share />
        <Button className="visio-cms-my-2">Preview</Button>
      </div>
    </div>
  );
}
