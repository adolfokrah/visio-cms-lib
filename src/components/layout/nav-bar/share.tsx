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
import { InvitedUser } from '@/lib/types';
import { areAllEmailsValid, cn, stringToColor } from '@/lib/utils';
import { Check, ChevronDown, Link, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarImage, AvatarFallback } from '../../ui/avatar';
import { useAuthState } from '@/lib/states/useAuthState';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function Share() {
  const {
    generateInvitationLink,
    inviteUsers,
    setEmailList,
    emailList,
    loading,
    users,
    changeRole,
    removeUser,
    userToDelete,
    setUserToDelete,
    isDeleting,
  } = useInvitation();
  const { user: authenticatedUser } = useAuthState();

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={'outline'} className="visio-cms-my-2">
            Share
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className="visio-cms-flex visio-cms-justify-between visio-cms-items-center visio-cms-mt-3">
                Share this project
                <Button
                  variant={'link'}
                  onClick={() => {
                    const link = generateInvitationLink();
                    if (link) {
                      navigator.clipboard
                        .writeText(link)
                        .then(() => {
                          toast.success('Link copied to clipboard');
                        })
                        .catch(() => {
                          toast.error('Failed to copy link to clipboard');
                        });
                    }
                  }}
                >
                  <Link size={12} className="visio-cms-mr-2" />
                  Copy link
                </Button>
              </div>
            </DialogTitle>
            <DialogDescription>
              <div className="visio-cms-flex visio-cms-gap-2 visio-cms-items-center visio-cms-mb-2">
                <Input
                  value={emailList}
                  placeholder="Inviter others by email"
                  onChange={(e) => setEmailList(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                      inviteUsers();
                    }
                  }}
                />
                <Button
                  className="visio-cms-h-8"
                  disabled={!areAllEmailsValid(emailList.replace(/ /g, '').split(','))}
                  onClick={inviteUsers}
                >
                  {loading ? <Loader size={16} className="visio-cms-animate-spin" /> : 'Invite'}
                </Button>
              </div>

              <Label>Who can access</Label>

              <div className="visio-cms-max-w-lg visio-cms-text-xs visio-cms-max-h-[500px] visio-cms-overflow-auto scrollbar-custom visio-cms-mt-2">
                {users.map((user) => {
                  const roles = ['Admin', 'Editor'];
                  if (user.first_name) {
                    roles.push('Owner');
                  }
                  return (
                    <div className="visio-cms-flex visio-cms-justify-between items-center">
                      <div
                        key={user.email}
                        className="visio-cms-flex visio-cms-items-center visio-cms-gap-2 visio-cms-mb-2"
                      >
                        <GenerateUserAvatar user={user} />
                        <p
                          className={cn('visio-cms-text-xs', {
                            'visio-cms-text-white': user.first_name,
                          })}
                        >
                          {user.first_name ? `${user.first_name} ${user.last_name}` : user.email}
                        </p>
                        <span className="visio-cms-text-xs visio-cms-text-gray-400">
                          {user?.email == authenticatedUser?.email && '(you)'}

                          {!user.first_name && ' (invited)'}
                        </span>
                      </div>

                      <div className="visio-cms-text-white">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild disabled={user?.role === 'Owner'}>
                            <Button variant={'ghost'}>
                              {user.role}
                              {user?.role != 'Owner' && <ChevronDown size={16} className="visio-cms-ml-2" />}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="!visio-cms-bg-dark-900">
                            {roles.map((role) => (
                              <DropdownMenuItem
                                key={role}
                                onClick={() => {
                                  changeRole(user.email, role);
                                }}
                              >
                                {role}
                                {user.role === role && (
                                  <DropdownMenuShortcut>
                                    <Check size={16} />
                                  </DropdownMenuShortcut>
                                )}
                              </DropdownMenuItem>
                            ))}

                            <DropdownMenuItem
                              onClick={() => {
                                setUserToDelete(user);
                              }}
                            >
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <AlertDialog open={userToDelete != null} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user's account from the project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="visio-cms-text-white">Cancel</AlertDialogCancel>
            <Button onClick={() => removeUser(userToDelete?.email || '')}>
              {isDeleting ? <Loader size={16} className="visio-cms-animate-spin" /> : 'Continue'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function GenerateUserAvatar({ user }: { user: InvitedUser }) {
  const userInitial = user.first_name
    ? `${user?.first_name.slice(0, 1)}${user?.last_name.slice(0, 1)}`
    : user.email.slice(0, 1).toUpperCase();

  return (
    <Avatar className="visio-cms-w-[35px] visio-cms-h-[35px] visio-cms-my-1 visio-cms-cursor-pointer">
      <AvatarImage src={user?.photo || ''} />
      <AvatarFallback
        className="visio-cms-text-white"
        style={{
          backgroundColor: stringToColor(user.email),
        }}
      >{`${userInitial.toUpperCase()}`}</AvatarFallback>
    </Avatar>
  );
}
