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
import { Check, ChevronDown, Link, Loader, Share2 } from 'lucide-react';
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
import { ROLES } from '@/lib/constants';

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
    resendInvite,
    fetchUsers,
  } = useInvitation();
  const { user: authenticatedUser } = useAuthState();

  if (authenticatedUser?.user_metadata?.role == 'Editor') return null;

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={'ghost'} className="visio-cms-my-2" onClick={fetchUsers}>
            Share
            <Share2 size={12} className="visio-cms-ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className="visio-cms-flex visio-cms-justify-between visio-cms-items-center visio-cms-mt-3">
                Share this project
                <Button
                  variant={'link'}
                  onClick={async () => {
                    const link = await generateInvitationLink();
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
            <DialogDescription />
            <div className="visio-cms-flex visio-cms-gap-2 visio-cms-text-white visio-cms-mb-4 visio-cms-items-center visio-cms-mb-2">
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
                const roles = [ROLES.ADMIN, ROLES.EDITOR];
                if (user.first_name && authenticatedUser?.user_metadata?.role === ROLES.OWNER) {
                  roles.push(ROLES.OWNER);
                }
                return (
                  <div className="visio-cms-flex visio-cms-justify-between items-center" key={user.email}>
                    <div className="visio-cms-flex visio-cms-items-center visio-cms-gap-2 visio-cms-mb-2">
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
                        <DropdownMenuTrigger asChild disabled={user?.role === ROLES.OWNER}>
                          <Button variant={'ghost'}>
                            {user.role}
                            {user?.role != ROLES.OWNER && <ChevronDown size={16} className="visio-cms-ml-2" />}
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

                          {!user.first_name && (
                            <DropdownMenuItem
                              onClick={async () => {
                                if (user?.email) resendInvite(user?.email);
                              }}
                            >
                              Resend invite
                            </DropdownMenuItem>
                          )}

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
    <Avatar className="visio-cms-w-[25px] visio-cms-h-[25px] visio-cms-my-1 visio-cms-cursor-pointer">
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
