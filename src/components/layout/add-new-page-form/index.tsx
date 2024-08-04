import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { VISIO_DOCS_BASE_URL } from '@/lib/constants';
import SlugInput from './slug-input';
import CodeTag from '@/components/ui/code-tag';
import usePage from '@/lib/hooks/usePage';

export default function AddNewPageForm({
  open,
  onClose,
  parentSlug,
  parentPage,
}: {
  open: boolean;
  onClose: () => void;
  parentSlug: string;
  parentPage: string;
}) {
  const { addPageForm, loading, onAddPage } = usePage({ onPageAdded: () => onClose() });
  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{parentSlug.length > 1 ? 'Add a sub page' : 'Add new page'}</DialogTitle>
          <DialogDescription>
            <Form {...addPageForm}>
              <form
                className="visio-cms-space-y-4"
                onSubmit={addPageForm.handleSubmit((data) =>
                  onAddPage({ ...data, slug: `${parentSlug}${data.slug}`, parentPage }),
                )}
              >
                <FormField
                  control={addPageForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className=" visio-cms-flex visio-cms-flex-col visio-cms-gap-[6px]">
                      <FormLabel className="visio-cms-ml-[2px]">Page name</FormLabel>
                      <FormControl>
                        <Input type="name" placeholder="Enter page name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addPageForm.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem className=" visio-cms-flex visio-cms-flex-col visio-cms-gap-[6px]">
                      <FormLabel className="visio-cms-ml-[2px]">Slug</FormLabel>
                      <FormControl>
                        <SlugInput {...field} parentSlug={parentSlug} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <p className="visio-cms-leading-7">
                  The page <CodeTag>slug</CodeTag> represents the url of the page, to accept parameters on your page use{' '}
                  <CodeTag>/:param</CodeTag>. where <CodeTag>param</CodeTag> should be the name of your parameter. To
                  access the parameter in your sections, use the{' '}
                  <CodeTag className="visio-cms-text-primary">useParams</CodeTag> hook from visio-cms. Learn more about
                  params{' '}
                  <Link to={`${VISIO_DOCS_BASE_URL}/params`} target="_blank" className="visio-cms-text-primary">
                    here
                  </Link>
                </p>

                <Button disabled={loading} className="visio-cms-w-full" type="submit">
                  {loading ? <Loader size={16} className="visio-cms-animate-spin" /> : 'Add page'}
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
