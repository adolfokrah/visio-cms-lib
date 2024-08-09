import { forgottenPasswordSchema, loginSchema, registrationSchema, updatePasswordSchema } from '../zod-schemas';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PAGES } from '../constants';
import { toast } from 'sonner';
import { supabase } from '../utils';
import { useAuthState } from '../states/useAuthState';
import { updateProfileDetailsSchema } from '../zod-schemas/update-profile-details-schema';
import { useProjectConfigurationState } from '../states/useProjectConfigState';
import { v4 as uuidv4 } from 'uuid';

export default function useAuth(page?: string) {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, clearUser, fetchUser } = useAuthState();
  const { bucketName } = useProjectConfigurationState();
  const navigate = useNavigate();
  const db = supabase();

  useEffect(() => {
    if (user && page != PAGES.UPDATE_PASSWORD) navigate(PAGES.BUILDER);
  }, [user, navigate, page]);

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
      role: 'Owner',
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

  const updateProfileDetailsForm = useForm<z.infer<typeof updateProfileDetailsSchema>>({
    resolver: zodResolver(updateProfileDetailsSchema),
    defaultValues: {
      firstName: user?.user_metadata?.first_name || '',
      lastName: user?.user_metadata?.last_name || '',
      email: user?.email || '',
      role: user?.user_metadata?.role || 'Owner',
      oldPassword: '',
      password: '',
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
      await fetchUser();
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
        role: '',
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
      toast.success('Success', { description: 'Password reset link sent' });
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
      toast.success('Success', { description: 'Password updated' });
      navigate(PAGES.BUILDER);
    } catch (e) {
      setErrorMessage('Ops! an error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function onUpdateProfileDetails(data: z.infer<typeof updateProfileDetailsSchema>) {
    const firstName = data.firstName;
    const lastName = data.lastName;
    const email = data.email;
    const role = data.role;
    const oldPassword = data.oldPassword;
    const password = data.password;

    setLoading(true);
    setErrorMessage('');
    try {
      const { error } = await db.auth.updateUser(
        {
          email: email,
          data: {
            first_name: firstName,
            last_name: lastName,
            role,
          },
        },
        {
          emailRedirectTo: `${window.location.protocol}//${window.location.host}${PAGES.LOGIN}`,
        },
      );

      if (error) {
        setErrorMessage(error?.message);
        return;
      }
      await db
        .from('users')
        .update({ first_name: firstName, last_name: lastName, role, email })
        .eq('email', user?.email);

      if (oldPassword && password) {
        const verifyResponse = await db.rpc('verify_password', { password: oldPassword });
        if (!verifyResponse.data) {
          setErrorMessage('Old password is invalid');
          return;
        }

        const { error: passwordError } = await db.auth.updateUser({
          email,
          password,
        });
        if (passwordError) {
          setErrorMessage(passwordError?.message);
          return;
        }
      }
      fetchUser();
      toast.success('Success', { description: 'Profile updated' });
    } catch (e) {
      setErrorMessage('Ops! an error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function onLogout() {
    setLoading(true);
    try {
      const { error } = await db.auth.signOut();
      if (error) {
        setErrorMessage(error?.message);
        return;
      }

      navigate(PAGES.LOGIN);
      clearUser();
    } catch (e) {
      setErrorMessage('Ops! an error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function updateProfilePhoto(file?: File) {
    try {
      setLoading(true);
      let imageUrl = '';
      if (file) {
        const ext = file.name.substring(file.name.lastIndexOf('.')).replace('.', '');
        const fileName = `${uuidv4()}.${ext}`;

        const { data, error } = await db.storage.from(bucketName).upload(fileName, file);
        if (error) {
          throw new Error(error.message);
        }
        imageUrl = db.storage.from(bucketName).getPublicUrl(data?.path)?.data?.publicUrl;
      }

      const { error: updatingUserError } = await db.auth.updateUser({
        email: user?.email,
        data: {
          ...user?.user_metadata,
          photo: imageUrl,
        },
      });

      if (updatingUserError) {
        throw new Error(updatingUserError.message);
      }

      await db.from('users').update({ photo: imageUrl }).eq('email', user?.email);

      fetchUser();
      toast.success('Success', { description: 'Profile photo updated' });
    } catch (e: any) {
      setErrorMessage(e);
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
    updateProfileDetailsForm,
    onUpdateProfileDetails,
    onLogout,
    updateProfilePhoto,
  };
}
