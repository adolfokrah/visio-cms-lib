import { loginSchema } from '../zod-schemas';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import useDb from './useDb';
import { toast } from 'sonner';

export default function useAuth() {
  const db = useDb();
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onLogin(data: z.infer<typeof loginSchema>) {
    const email = data.email;
    const password = data.password;

    const { data: responseData, error } = await db.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast('Failed', {
        description: error?.message,
      });
      return;
    }

    console.log(responseData);
  }

  return { onLogin, loginForm };
}
