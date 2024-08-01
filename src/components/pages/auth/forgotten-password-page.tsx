import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import useAuth from '@/lib/hooks/useAuth';
import ErrorAlert from '@/components/ui/error-alert';
import { Loader } from 'lucide-react';

export default function ForgottenPasswordPage() {
  const { onSendPasswordResetLink, forgottenPasswordForm, errorMessage, setErrorMessage, loading, fetchingUser } =
    useAuth();

  if (fetchingUser) return null;
  return (
    <div className="visio-cms-bg-dark-900 visio-cms-px-3 visio-cms-text-white visio-cms-text-xs visio-cms-h-screen visio-cms-flex visio-cms-items-center visio-cms-place-content-center">
      <div className="visio-cms-w-full md:visio-cms-w-[350px] ">
        <h3 className="visio-cms-text-xl visio-cms-text-center">Forgotten Password?</h3>
        <ErrorAlert
          errorMessage={errorMessage}
          key={errorMessage}
          onClearError={() => setErrorMessage('')}
          className="visio-cms-mt-4"
        />
        <Form {...forgottenPasswordForm}>
          <form
            className="visio-cms-mt-[35px] visio-cms-space-y-[25px]"
            onSubmit={forgottenPasswordForm.handleSubmit(onSendPasswordResetLink)}
          >
            <FormField
              control={forgottenPasswordForm.control}
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
            <Button disabled={loading} className="visio-cms-w-full" type="submit">
              {loading ? <Loader size={16} className="visio-cms-animate-spin" /> : 'Send link'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
