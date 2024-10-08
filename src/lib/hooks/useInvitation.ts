import { toast } from 'sonner';
import { signToken, supabase } from '../utils';
import { PAGES, ROLES } from '../constants';
import { useProjectConfigurationState } from '../states/useProjectConfigState';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { InvitedUser } from '../types';
import { useAuthState } from '../states/useAuthState';

export default function useInvitation() {
  const { projectId, emailSender } = useProjectConfigurationState();
  const [emailList, setEmailList] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<InvitedUser[]>([]);
  const [userToDelete, setUserToDelete] = useState<InvitedUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { fetchUser, user: authenticatedUser } = useAuthState();
  const db = supabase();

  useEffect(() => {
    fetchUsers();
  }, []);

  const generateInvitationLink = async () => {
    const token = await signToken({ token: projectId });

    const link = `${window.location.protocol}//${window.location.host}${PAGES.REGISTER}?invite=${token}`;
    return link;
  };

  const inviteUsers = async () => {
    try {
      setLoading(true);
      if (emailList.length === 0) {
        throw new Error('Emails are required');
      }
      let emails = emailList.replace(/ /g, '').split(',');

      const { data: users } = await db.from('users').select('email').in('email', emails);

      if (users?.length) {
        emails = emails.filter((email) => !users.find((user) => user.email === email));
      }
      if (emails.length === 0) throw new Error('All emails are already registered');

      const data = await sendInvitation(emails);

      if (data?.data.length) {
        const { error } = await db
          .from('users')
          .insert(emails.map((email) => ({ id: uuidv4(), email, role: 'Editor' })))
          .select('*');
        if (error) {
          throw new Error(error.message);
        }
        toast.success('Invitation sent');
        fetchUsers();
        setEmailList('');
      } else {
        throw new Error('Failed to send invitation');
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    const { data: users, error } = await db
      .from('users')
      .select('*')
      .neq('email', null)
      .order('created_at', { ascending: false });
    if (error) {
      toast.error(error.message);
    }
    if (users?.length) {
      setUsers(
        users.sort(
          (a: any, b: any) => (new Date(b.createdAt) as any) - (new Date(a.createdAt) as any),
        ) as InvitedUser[],
      );
    }
  };

  const changeRole = async (email: string, role: string) => {
    try {
      setLoading(true);

      if (role === ROLES.OWNER) {
        await db.from('users').update({ role: 'Editor' }).eq('role', ROLES.OWNER);
      }
      const { error } = await db.from('users').update({ role }).eq('email', email);

      if (error) {
        throw new Error(error?.message);
      }
      toast.success('Role updated');
      fetchUsers();
      fetchUser();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (email: string) => {
    try {
      setIsDeleting(true);
      const { error } = await db.from('users').delete().eq('email', email);

      if (error) {
        throw new Error(error.message);
      }

      const { error: userDeletionError } = await db.functions.invoke('users-delete', {
        body: { email },
      });
      if (userDeletionError) {
        throw new Error(userDeletionError.message);
      }

      toast.success('User removed');
      fetchUsers();
      if (email === authenticatedUser?.email) {
        window.open(PAGES.LOGIN);
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  const sendInvitation = async (emails: string[]) => {
    try {
      const invitationLInk = await generateInvitationLink();
      const siteUrl = `${window.location.protocol}//${window.location.host}`;

      const { data, error } = await db.functions.invoke('send-invitation', {
        body: { emails, invitationLInk, siteUrl, from: emailSender },
      });
      if (error) {
        throw new Error(error.message);
      }

      if (!data?.data.length) {
        throw new Error('Failed to send invitation');
      }

      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const resendInvite = async (email: string) => {
    try {
      setLoading(true);
      await sendInvitation([email]);
      toast.success('Invitation sent');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
