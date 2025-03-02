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
import { PageTreeItem } from '@/lib/types';
import { Loader } from 'lucide-react';

export default function DeletePageAction({
  page,
  open,
  onClose,
}: {
  page: PageTreeItem;
  onClose: () => void;
  open: { withPages: boolean } | null;
}) {
  const { loading, deletePage } = usePage({});
  return (
    <AlertDialog open={open != null} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="visio-cms-leading-7">
            This action cannot be undone. This will permanently delete the {page.type == 'Folder' ? 'folder' : 'page'}{' '}
            <CodeTag>{page.name}</CodeTag> {open?.withPages && 'including all child pages'} and remove it's data from
            your server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="visio-cms-text-white">Cancel</AlertDialogCancel>
          <Button
            disabled={loading}
            variant={'destructive'}
            className="visio-cms-min-w-[60px]"
            onClick={() => deletePage(page, open?.withPages || false)}
          >
            {loading ? <Loader size={16} className="visio-cms-animate-spin" /> : 'Continue'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
