import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import VisioLogo from '@/components/ui/visio-logo';
import { useNavigate } from 'react-router-dom';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import useAuth from '@/lib/hooks/useAuth';
import ErrorAlert from '@/components/ui/error-alert';
import { Loader } from 'lucide-react';
import { PAGES } from '@/lib/constants';

export default function LoginPage() {
  const navigate = useNavigate();
  const { onLogin, loginForm, errorMessage, setErrorMessage, loading, fetchingUser } = useAuth();
  if (fetchingUser) return null;
  return (
    <div className="visio-cms-bg-dark-900 visio-cms-px-3 visio-cms-text-white visio-cms-text-xs visio-cms-h-screen visio-cms-flex visio-cms-items-center visio-cms-place-content-center">
      <div className="visio-cms-w-full md:visio-cms-w-[350px] ">
        <VisioLogo className="visio-cms-m-auto visio-cms-mb-[54px]" />
        <h3 className="visio-cms-text-xl visio-cms-text-center">Welcome to visio cms</h3>
        <ErrorAlert
          errorMessage={errorMessage}
          key={errorMessage}
          onClearError={() => setErrorMessage('')}
          className="visio-cms-mt-4"
        />
        <Form {...loginForm}>
          <form className="visio-cms-mt-[35px] visio-cms-space-y-[25px]" onSubmit={loginForm.handleSubmit(onLogin)}>
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem className=" visio-cms-flex visio-cms-flex-col visio-cms-gap-[6px]">
                  <FormLabel className="visio-cms-ml-[2px]">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="!visio-cms-bg-dark-800"
                      type="email"
                      placeholder="Enter your email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem className="visio-cms-flex visio-cms-flex-col visio-cms-gap-[6px]">
                  <FormLabel className="visio-cms-ml-[2px]">Password</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="false"
                      className="!visio-cms-bg-dark-800"
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={loading} className="visio-cms-w-full" type="submit">
              {loading ? <Loader size={16} className="visio-cms-animate-spin" /> : 'Login'}
            </Button>
            <Button className="visio-cms-w-full" variant={'link'} onClick={() => navigate(PAGES.FORGOTTEN_PASSWORD)}>
              Forgotten password?
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
