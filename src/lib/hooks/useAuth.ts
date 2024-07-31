import { loginSchema } from '../zod-schemas';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import useDb from './useDb';
import { useState } from 'react';

export default function useAuth() {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      const { data: responseData, error } = await db.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setErrorMessage(error?.message);
        return;
      }
      console.log(responseData);
    } catch (e) {
      setErrorMessage('Ops! an error occurred');
    } finally {
      setLoading(false);
    }
  }

  return { onLogin, loginForm, errorMessage, setErrorMessage, loading };
}
