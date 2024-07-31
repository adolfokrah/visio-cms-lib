import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
  return (
    <div className="visio-cms-bg-dark-900 visio-cms-text-white visio-cms-text-xs visio-cms-h-screen visio-cms-flex visio-cms-items-center visio-cms-place-content-center">
      <div className="visio-cms-w-full md:visio-cms-w-[350px] ">
        <h3 className="visio-cms-text-xl visio-cms-text-center">Register</h3>
        <div className="visio-cms-mt-[35px] visio-cms-space-y-[25px]">
          <div className=" visio-cms-flex visio-cms-flex-col visio-cms-gap-[6px]">
            <Label className="visio-cms-ml-[2px]">First name</Label>
            <Input className="!visio-cms-bg-dark-800" placeholder="Enter first name" />
          </div>
          <div className=" visio-cms-flex visio-cms-flex-col visio-cms-gap-[6px]">
            <Label className="visio-cms-ml-[2px]">Last name</Label>
            <Input className="!visio-cms-bg-dark-800" placeholder="Enter last name" />
          </div>
          <div className=" visio-cms-flex visio-cms-flex-col visio-cms-gap-[6px]">
            <Label className="visio-cms-ml-[2px]">Email</Label>
            <Input className="!visio-cms-bg-dark-800" type="email" placeholder="Enter email address" />
          </div>
          <div className=" visio-cms-flex visio-cms-flex-col visio-cms-gap-[6px]">
            <Label className="visio-cms-ml-[2px]">Password</Label>
            <Input className="!visio-cms-bg-dark-800" type="password" placeholder="Enter your password" />
          </div>
          <Button className="visio-cms-w-full">Sign up</Button>
        </div>
      </div>
    </div>
  );
}
