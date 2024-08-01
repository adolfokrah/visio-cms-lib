import { useAuthState } from '@/lib/states/useAuthState';
import { Avatar, AvatarImage, AvatarFallback } from '../../ui/avatar';
import VisioLogo from '../../ui/visio-logo';
import { Separator } from '../../ui/separator';
import { Button } from '../../ui/button';

export default function Navbar() {
  const { user } = useAuthState();
  const userInitial = `${user?.user_metadata['first_name'].slice(0, 1)}${user?.user_metadata['last_name'].slice(0, 1)}`;
  return (
    <div className="visio-cms-px-8 visio-cms-animate-slide-from-top visio-cms-fixed visio-cms-top-0 visio-cms-left-0 visio-cms-w-full visio-cms-bg-dark-700 visio-cms-flex visio-cms-justify-between">
      <VisioLogo className="visio-cms-my-1" />

      <div className="visio-cms-justify-between visio-cms-flex visio-cms-gap-2">
        <Avatar className="visio-cms-w-[35px] visio-cms-h-[35px] visio-cms-my-1">
          <AvatarImage src={user?.user_metadata['photo'] || ''} />
          <AvatarFallback>{`${userInitial.toUpperCase()}`}</AvatarFallback>
        </Avatar>
        <Separator orientation="vertical" className="visio-cms-bg-dark-900" />
        <Button variant={'outline'} className="visio-cms-my-2">
          Share
        </Button>
        <Button className="visio-cms-my-2">Preview</Button>
      </div>
    </div>
  );
}
