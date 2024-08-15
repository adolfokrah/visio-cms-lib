import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '../input';
import { Button } from '../button';
import { Label } from '../label';
import { Editor } from '@tiptap/react';
import { useState } from 'react';
import { isValidURL } from '@/lib/utils';

export default function LinkPopOver({ editor, children }: { editor: Editor; children: React.ReactNode }) {
  const [link, setLink] = useState(editor.getAttributes('link').href);
  const [open, setOpen] = useState(false);

  const setUrl = () => {
    editor.commands.setLink({ href: link, target: '_blank' });
    setOpen(false);
    setLink('');
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div onClick={() => setOpen(true)} className="visio-cms-w-max">
          {children}
        </div>
      </PopoverTrigger>
      <PopoverContent className="visio-cms-space-y-2">
        <Label>URL</Label>
        <div className="visio-cms-flex visio-cms-space-x-2 visio-cms-items-center">
          <Input
            placeholder="Enter URL"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                if (isValidURL(link)) {
                  setUrl();
                }
              }
            }}
          />
          {editor.isActive('link') && (
            <Button
              variant={'ghost'}
              className="visio-cms-h-9"
              onClick={() => {
                editor.commands.unsetLink();
                setOpen(false);
                setLink('');
              }}
            >
              {' '}
              Remove Link{' '}
            </Button>
          )}
        </div>
        <Button
          className="visio-cms-w-full"
          disabled={!isValidURL(link)}
          onClick={() => {
            setUrl();
          }}
        >
          Insert link
        </Button>
      </PopoverContent>
    </Popover>
  );
}
