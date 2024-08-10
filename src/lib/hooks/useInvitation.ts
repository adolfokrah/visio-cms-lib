import { toast } from 'sonner';
import { supabase } from '../utils';

export default function useInvitation() {
  const db = supabase();
  const generateInvitationLink = async () => {
    const { data, error } = await db.auth.admin.generateLink({
      type: 'invite',
      email: 'adolfokrah@gmail.com',
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    console.log(data);
  };

  return { generateInvitationLink };
}
