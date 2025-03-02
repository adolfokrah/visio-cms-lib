import { Button } from '@/components/ui/button';
import CodeTag from '@/components/ui/code-tag';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ErrorAlert from '@/components/ui/error-alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { VISIO_DOCS_BASE_URL } from '@/lib/constants';
import useGlobalBlock from '@/lib/hooks/useGlobalBlock';
import { Loader } from 'lucide-react';

export default function AddGlobalBlockForm({
  open,
  onClose,
  pageBlockId,
}: {
  open: boolean;
  onClose: () => void;
  pageBlockId: string;
  propName: string;
  parentBlockId: string;
}) {
  const { onAddGlobalBlock, addGlobalBlockForm, loading, errorMessage, setErrorMessage } = useGlobalBlock(onClose);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Convert block to global</DialogTitle>
          <DialogDescription className="visio-cms-leading-7 visio-cms-text-xs">
            Global blocks can be used across your project. A single change in a global block will affect all instances
            in your project. Learn more about <CodeTag>Global blocks</CodeTag>{' '}
            <a href={`${VISIO_DOCS_BASE_URL}/global-blocks`} target="_blank" className="visio-cms-text-primary">
              here
            </a>
          </DialogDescription>
        </DialogHeader>
        <Form {...addGlobalBlockForm}>
          <form
            onSubmit={addGlobalBlockForm.handleSubmit((data) => onAddGlobalBlock({ ...data, pageBlockId }))}
            className="visio-cms-space-y-[25px]"
          >
            <ErrorAlert
              errorMessage={errorMessage || ''}
              key={errorMessage}
              onClearError={() => setErrorMessage(null)}
              className="visio-cms-mt-4 visio-cms-bg-dark-900"
            />

            <div>
              <FormField
                control={addGlobalBlockForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className=" visio-cms-flex visio-cms-flex-col visio-cms-gap-[6px]">
                    <FormLabel className="visio-cms-ml-[2px]">Block name</FormLabel>
                    <FormControl>
                      <Input className="visio-cms-text-white" type="text" placeholder="Enter block name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button disabled={loading} className="visio-cms-w-full" type="submit">
                {loading ? <Loader size={16} className="visio-cms-animate-spin" /> : 'Save block'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
