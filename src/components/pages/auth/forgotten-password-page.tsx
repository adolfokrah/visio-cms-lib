import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgottenPasswordPage() {
  return (
    <div className="visio-cms-bg-dark-900 visio-cms-text-white visio-cms-text-xs visio-cms-h-screen visio-cms-flex visio-cms-items-center visio-cms-place-content-center">
      <div className="visio-cms-w-full md:visio-cms-w-[350px] ">
        <div className="visio-cms-mt-[35px] visio-cms-space-y-[25px]">
          <div className=" visio-cms-flex visio-cms-flex-col visio-cms-gap-[6px]">
            <Label className="visio-cms-ml-[2px]">Email address</Label>
            <Input className="!visio-cms-bg-dark-800" type="email" placeholder="Enter your email address" />
          </div>

          <Button className="visio-cms-w-full">Send link</Button>
          <Button className="visio-cms-w-full" variant={'link'}>
            Resend link
          </Button>
        </div>
      </div>
    </div>
  );
}
