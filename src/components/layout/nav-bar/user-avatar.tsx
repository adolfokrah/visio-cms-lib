import { Avatar, AvatarImage, AvatarFallback } from '../../ui/avatar';
import { useAuthState } from '@/lib/states/useAuthState';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useAuth from '@/lib/hooks/useAuth';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader } from 'lucide-react';
import { PAGES } from '@/lib/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import ErrorAlert from '@/components/ui/error-alert';
import { stringToColor } from '@/lib/utils';

export default function UserAvatar() {
  const { user } = useAuthState();
  const {
    updateProfileDetailsForm,
    onUpdateProfileDetails,
    loading,
    onLogout,
    errorMessage,
    setErrorMessage,
    updateProfilePhoto,
  } = useAuth(PAGES.BUILDER);

  const [open, setOpen] = useState(false);
  if (!user) return null;

  const userInitial = `${user?.user_metadata['first_name'].slice(0, 1)}${user?.user_metadata['last_name'].slice(0, 1)}`;
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="visio-cms-w-[35px] visio-cms-h-[35px] visio-cms-my-1 visio-cms-cursor-pointer">
            <AvatarImage src={user?.user_metadata['photo'] || ''} />
            <AvatarFallback
              style={{ backgroundColor: stringToColor(user?.email || '') }}
            >{`${userInitial.toUpperCase()}`}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)}>Profile</DropdownMenuItem>
          <DropdownMenuItem className="visio-cms-text-destructive" onClick={onLogout}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="visio-cms-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              Edit profile
              <p className="visio-cms-text-xs visio-cms-font-regular visio-cms-text-gray-400 visio-cms-mt-2">
                Provide details about yourself and other pertinent information
              </p>
            </DialogTitle>
            <DialogDescription className="visio-cms-text-white">
              <ErrorAlert
                errorMessage={errorMessage}
                key={errorMessage}
                onClearError={() => setErrorMessage('')}
                className="visio-cms-my-4 visio-cms-bg-dark-900"
              />
              <h3 className="visio-cms-text-xl">Basic information</h3>

              <div className="visio-cms-grid visio-cms-grid-cols-4 visio-cms-mt-4">
                <div className="visio-cms-col-span-3">
                  <div>
                    <Label>Profile photo</Label>
                  </div>
                  <div className="visio-cms-flex visio-cms-gap-2 visio-cms-mt-3">
                    <Label
                      htmlFor={loading ? '' : 'upload'}
                      className="visio-cms-rounded-md visio-cms-p-2 visio-cms-border visio-cms-border-white visio-cms-cursor-pointer"
                    >
                      Change
                    </Label>
                    <input
                      type="file"
                      id="upload"
                      className="visio-cms-hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          const file = e.target.files[0];
                          updateProfilePhoto(file);
                        }
                      }}
                    />
                    <Label
                      onClick={() => {
                        if (loading) return;
                        updateProfilePhoto();
                      }}
                      className="visio-cms-rounded-md visio-cms-p-2 visio-cms-border visio-cms-border-white visio-cms-cursor-pointer"
                    >
                      Remove
                    </Label>
                  </div>
                </div>
                <div>
                  <Avatar className="visio-cms-w-[60px] visio-cms-h-[60px]">
                    <AvatarImage src={user?.user_metadata['photo'] || ''} />
                    <AvatarFallback
                      style={{ backgroundColor: stringToColor(user?.email || '') }}
                    >{`${userInitial.toUpperCase()}`}</AvatarFallback>
                  </Avatar>
                </div>
              </div>

              <Form {...updateProfileDetailsForm}>
                <form
                  className="visio-cms-mt-4"
                  onSubmit={updateProfileDetailsForm.handleSubmit(onUpdateProfileDetails)}
                >
                  <FormField
                    control={updateProfileDetailsForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className=" visio-cms-flex visio-cms-flex-col visio-cms-gap-[6px]">
                        <FormLabel className="visio-cms-ml-[2px]">First name</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter your first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={updateProfileDetailsForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className=" visio-cms-flex visio-cms-flex-col visio-cms-gap-[6px] visio-cms-mt-6">
                        <FormLabel className="visio-cms-ml-[2px]">Last name</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter your last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={updateProfileDetailsForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className=" visio-cms-flex visio-cms-flex-col visio-cms-gap-[6px] visio-cms-mt-6">
                        <FormLabel className="visio-cms-ml-[2px]">Email</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter your email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={updateProfileDetailsForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className=" visio-cms-flex visio-cms-flex-col visio-cms-gap-[6px] visio-cms-mt-6">
                        <FormLabel className="visio-cms-ml-[2px]">Role</FormLabel>
                        <FormControl>
                          <Input type="text" readOnly {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={updateProfileDetailsForm.control}
                    name="oldPassword"
                    render={({ field }) => (
                      <FormItem className=" visio-cms-flex visio-cms-flex-col visio-cms-gap-[6px] visio-cms-mt-6">
                        <FormLabel className="visio-cms-ml-[2px]">Old password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={updateProfileDetailsForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className=" visio-cms-flex visio-cms-flex-col visio-cms-gap-[6px] visio-cms-mt-6">
                        <FormLabel className="visio-cms-ml-[2px]">New password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button disabled={loading} className="visio-cms-w-full visio-cms-mt-6" type="submit">
                    {loading ? <Loader size={16} className="visio-cms-animate-spin" /> : 'Save changes'}
                  </Button>
                </form>
              </Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
