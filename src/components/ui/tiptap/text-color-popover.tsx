import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '../button';
import { Editor } from '@tiptap/react';
import { useState, cloneElement } from 'react';
import ColorChooser from '../color-chooser';

export default function TextColorPopOver({
  editor,
  children,
  type = 'text',
}: {
  editor: Editor;
  children: React.ReactNode;
  type?: 'text' | 'background';
}) {
  const editorColor =
    type === 'text' ? editor.getAttributes('textStyle').color : editor.getAttributes('highlight').color;
  const [color, setColor] = useState(editorColor);
  const [open, setOpen] = useState(false);

  const insertColor = () => {
    if (type === 'text') editor.commands.setColor(color);
    else editor.commands.setHighlight({ color });

    setColor('');
    setOpen(false);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div onClick={() => setOpen(true)} style={{ backgroundColor: color }} className="visio-cms-rounded-md">
          {cloneElement(children as React.ReactElement, {})}
        </div>
      </PopoverTrigger>
      <PopoverContent className="visio-cms-space-y-2 visio-cms-w-max">
        <ColorChooser
          colorHex={color}
          onChange={(color) => {
            setColor(() => color);
          }}
        />
        <Button
          className="visio-cms-w-full"
          onClick={() => {
            insertColor();
          }}
        >
          Insert color
        </Button>
      </PopoverContent>
    </Popover>
  );
}
