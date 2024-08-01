import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import useAuth from '@/lib/hooks/useAuth';
import ErrorAlert from '@/components/ui/error-alert';
import { Loader } from 'lucide-react';
import { getQueryParamsFromUrl } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { PAGES } from '@/lib/constants';
import { useEffect } from 'react';

export default function UpdatePasswordPage() {
  const { onUpdatePassword, updatePasswordForm, errorMessage, setErrorMessage, loading } = useAuth();
  const path = getQueryParamsFromUrl(window.location.href.replace('/#/g', '&'));
  const navigate = useNavigate();

  useEffect(() => {
    if (path['error_code'] || !path['token']) {
      navigate(PAGES.PAGE_NOT_FOUND);
    }
  }, [path, navigate]);

  return (
    <div className="visio-cms-bg-dark-900 visio-cms-px-3 visio-cms-text-white visio-cms-text-xs visio-cms-h-screen visio-cms-flex visio-cms-items-center visio-cms-place-content-center">
      <div className="visio-cms-w-full md:visio-cms-w-[350px] ">
        <h3 className="visio-cms-text-xl visio-cms-text-center">Update your password</h3>
        <ErrorAlert
          errorMessage={errorMessage}
          key={errorMessage}
          onClearError={() => setErrorMessage('')}
          className="visio-cms-mt-4"
        />
        <Form {...updatePasswordForm}>
          <form
            className="visio-cms-mt-[35px] visio-cms-space-y-[25px]"
            onSubmit={updatePasswordForm.handleSubmit((data) => onUpdatePassword(data, atob(path['token'])))}
          >
            <FormField
              control={updatePasswordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="visio-cms-flex visio-cms-flex-col visio-cms-gap-[6px]">
                  <FormLabel className="visio-cms-ml-[2px]">New Password</FormLabel>
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
            <FormField
              control={updatePasswordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="visio-cms-flex visio-cms-flex-col visio-cms-gap-[6px]">
                  <FormLabel className="visio-cms-ml-[2px]">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="false"
                      className="!visio-cms-bg-dark-800"
                      type="password"
                      placeholder="Repeat password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={loading} className="visio-cms-w-full" type="submit">
              {loading ? <Loader size={16} className="visio-cms-animate-spin" /> : 'Update Password'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
