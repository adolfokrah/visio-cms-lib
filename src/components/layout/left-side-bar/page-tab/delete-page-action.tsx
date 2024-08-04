import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import CodeTag from '@/components/ui/code-tag';
import usePage from '@/lib/hooks/usePage';
import { PageGroup } from '@/lib/types';
import { Loader } from 'lucide-react';

export default function DeletePageAction({
  page,
  open,
  onClose,
}: {
  page: PageGroup;
  onClose: () => void;
  open: boolean;
}) {
  const { loading, deletePage } = usePage({});
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="visio-cms-leading-7">
            This action cannot be undone. This will permanently delete the page <CodeTag>{page.name}</CodeTag> and
            remove it's data from your server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="visio-cms-text-white">Cancel</AlertDialogCancel>
          <Button
            disabled={loading}
            variant={'destructive'}
            className="visio-cms-min-w-[60px]"
            onClick={() => deletePage(page.id)}
          >
            {loading ? <Loader size={16} className="visio-cms-animate-spin" /> : 'Continue'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
