import { forgottenPasswordSchema, loginSchema, registrationSchema, updatePasswordSchema } from '../zod-schemas';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import useDb from './useDb';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PAGES } from '../constants';
import { toast } from 'sonner';

export default function useAuth() {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const db = useDb();

  useEffect(() => {
    (async () => {
      const { data } = await db.auth.getUser();
      if (data.user) navigate(PAGES.BUILDER);
    })();
  }, [navigate, db.auth]);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const registrationForm = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const forgottenPasswordForm = useForm<z.infer<typeof forgottenPasswordSchema>>({
    resolver: zodResolver(forgottenPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const updatePasswordForm = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  async function onLogin(data: z.infer<typeof loginSchema>) {
    const email = data.email;
    const password = data.password;
    setLoading(true);
    try {
      const { error } = await db.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setErrorMessage(error?.message);
        return;
      }
      navigate(PAGES.BUILDER);
    } catch (e) {
      setErrorMessage('Ops! an error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function onRegister(data: z.infer<typeof registrationSchema>) {
    const email = data.email;
    const password = data.password;
    const firstName = data.firstName;
    const lastName = data.lastName;
    setLoading(true);
    try {
      const { data: users } = await db.from('users').select('id').eq('email', email).limit(1);
      if (users?.length) {
        setErrorMessage('User already exist');
        return;
      }
      const metaData = {
        first_name: firstName,
        last_name: lastName,
      };
      const { error, data: d } = await db.auth.signUp({
        email,
        password,
        options: {
          data: metaData,
          emailRedirectTo: `${window.location.protocol}//${window.location.host}${PAGES.LOGIN}`,
        },
      });

      const { error: insertError } = await db.from('users').insert({ id: d.user?.id, ...metaData, email });

      if (error || insertError) {
        setErrorMessage(error?.message || insertError?.message || '');
        return;
      }
      navigate(PAGES.BUILDER);
    } catch (e) {
      setErrorMessage('Ops! an error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function onSendPasswordResetLink(data: z.infer<typeof forgottenPasswordSchema>) {
    const email = data.email;
    setLoading(true);
    try {
      const { error } = await db.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.protocol}//${window.location.host}${PAGES.UPDATE_PASSWORD}?token=${btoa(email)}`,
      });
      if (error) {
        setErrorMessage(error?.message);
        return;
      }
      toast('Success', { description: 'Password reset link sent' });
    } catch (e) {
      setErrorMessage('Ops! an error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function onUpdatePassword(data: z.infer<typeof updatePasswordSchema>, email: string) {
    const password = data.newPassword;

    setLoading(true);
    try {
      const { error } = await db.auth.updateUser({
        email,
        password,
      });
      if (error) {
        setErrorMessage(error?.message);
        return;
      }
      toast('Success', { description: 'Password updated' });
    } catch (e) {
      setErrorMessage('Ops! an error occurred');
    } finally {
      setLoading(false);
    }
  }

  return {
    onLogin,
    loginForm,
    errorMessage,
    setErrorMessage,
    loading,
    registrationForm,
    onRegister,
    forgottenPasswordForm,
    onSendPasswordResetLink,
    updatePasswordForm,
    onUpdatePassword,
  };
}
