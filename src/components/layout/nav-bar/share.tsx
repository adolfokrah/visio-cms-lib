import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useInvitation from '@/lib/hooks/useInvitation';
import { Link } from 'lucide-react';

export default function Share() {
  const { generateInvitationLink } = useInvitation();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'outline'} className="visio-cms-my-2">
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="visio-cms-max-w-lg visio-cms-max-h-[400px]">
        <DialogHeader>
          <DialogTitle>
            <div className="visio-cms-flex visio-cms-justify-between visio-cms-items-center">
              Share this project
              <Button variant={'link'} onClick={generateInvitationLink}>
                <Link size={12} className="visio-cms-mr-2" />
                Copy link
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>
            <div className="visio-cms-flex visio-cms-gap-2 visio-cms-items-center visio-cms-mb-2">
              <Input placeholder="Inviter others by email" />
              <Button className="visio-cms-h-8">Invite</Button>
            </div>

            <Label>Who can access</Label>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
