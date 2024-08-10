import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import useAuth from '@/lib/hooks/useAuth';
import ErrorAlert from '@/components/ui/error-alert';
import { Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getQueryParamsFromUrl } from '@/lib/utils';

export default function RegisterPage() {
  const {
    onRegister,
    registrationForm,
    errorMessage,
    setErrorMessage,
    loading,
    checkInvitationToken,
    checkIfUserIsAuthorized,
  } = useAuth();

  const path = getQueryParamsFromUrl(window.location.href.replace('/#/g', '&'));
  const navigate = useNavigate();

  useEffect(() => {
    if (path['invite']) {
      checkInvitationToken(path['invite'], path['e']);
    } else {
      checkIfUserIsAuthorized();
    }
  }, [path, navigate, checkInvitationToken, checkIfUserIsAuthorized]);

  return (
    <div className="visio-cms-bg-dark-900 visio-cms-px-3 visio-cms-text-white visio-cms-text-xs visio-cms-h-screen visio-cms-flex visio-cms-items-center visio-cms-place-content-center">
      <div className="visio-cms-w-full md:visio-cms-w-[350px] ">
        <h3 className="visio-cms-text-xl visio-cms-text-center">Register</h3>
        <ErrorAlert
          errorMessage={errorMessage}
          key={errorMessage}
          onClearError={() => setErrorMessage('')}
          className="visio-cms-mt-4"
        />
        <Form {...registrationForm}>
          <form
            className="visio-cms-mt-[35px] visio-cms-space-y-[25px]"
            onSubmit={registrationForm.handleSubmit((data) =>
              onRegister({ ...data, token: path['invite'], withEmail: path['e'] ? true : false }),
            )}
          >
            <FormField
              control={registrationForm.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className=" visio-cms-flex visio-cms-flex-col visio-cms-gap-[6px]">
                  <FormLabel className="visio-cms-ml-[2px]">First name</FormLabel>
                  <FormControl>
                    <Input className="!visio-cms-bg-dark-800" placeholder="Enter your first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={registrationForm.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className=" visio-cms-flex visio-cms-flex-col visio-cms-gap-[6px]">
                  <FormLabel className="visio-cms-ml-[2px]">Last name</FormLabel>
                  <FormControl>
                    <Input className="!visio-cms-bg-dark-800" placeholder="Enter your last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={registrationForm.control}
              name="email"
              render={({ field }) => (
                <FormItem className=" visio-cms-flex visio-cms-flex-col visio-cms-gap-[6px]">
                  <FormLabel className="visio-cms-ml-[2px]">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="!visio-cms-bg-dark-800"
                      type="email"
                      placeholder="Enter your email address"
                      readOnly={path['e'] ? true : false}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={registrationForm.control}
              name="password"
              render={({ field }) => (
                <FormItem className="visio-cms-flex visio-cms-flex-col visio-cms-gap-[6px]">
                  <FormLabel className="visio-cms-ml-[2px]">Password</FormLabel>
                  <FormControl>
                    <Input
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
              {loading ? <Loader size={16} className="visio-cms-animate-spin" /> : 'Sign up'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
