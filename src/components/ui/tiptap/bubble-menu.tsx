import { Editor } from '@tiptap/react';
import { EDITOR_MENU_CONTROLS } from '@/lib/constants';
import { EditorControlTypes, MenuControlsType } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn, supabase } from '@/lib/utils';
import MediaExplorer from '../media-explorer';
import { useMemo, useState } from 'react';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import LinkPopOver from './link-popover';
import TextColorPopOver from './text-color-popover';
import { Button } from '../button';

export default function CustomBubbleMenu({
  editor,
  allowedControls = [...EDITOR_MENU_CONTROLS.map((control) => control.name)],
}: {
  editor: Editor;
  allowedControls?: EditorControlTypes[];
}) {
  const [openMediaExplorer, setOpenMediaExplorer] = useState(false);
  const db = useMemo(() => supabase(), []);
  const { bucketName } = useProjectConfigurationState();
  const mappedControlActions = {
    bold: () => editor.chain().focus().toggleBold().run(),
    italic: () => editor.chain().focus().toggleItalic().run(),
    strike: () => editor.chain().focus().toggleStrike().run(),
    underline: () => editor.chain().focus().toggleUnderline().run(),
    code: () => editor.chain().focus().toggleCode().run(),
    paragraph: () => editor.chain().focus().setParagraph().run(),
    h1: () => editor.chain().focus().setHeading({ level: 1 }).run(),
    h2: () => editor.chain().focus().setHeading({ level: 2 }).run(),
    h3: () => editor.chain().focus().setHeading({ level: 3 }).run(),
    h4: () => editor.chain().focus().setHeading({ level: 4 }).run(),
    h5: () => editor.chain().focus().setHeading({ level: 5 }).run(),
    h6: () => editor.chain().focus().setHeading({ level: 6 }).run(),
    'bullet-list': () => editor.chain().focus().toggleBulletList().run(),
    'ordered-list': () => editor.chain().focus().toggleOrderedList().run(),
    blockquote: () => editor.chain().focus().toggleBlockquote().run(),
    link: () => {},
    'text-color': () => {},
    'background-color': () => {},
    image: () => {
      setOpenMediaExplorer(true);
    },
    'align-center': () => editor.chain().focus().setTextAlign('center').run(),
    'align-right': () => editor.chain().focus().setTextAlign('right').run(),
    'align-left': () => editor.chain().focus().setTextAlign('left').run(),
    'align-justify': () => editor.chain().focus().setTextAlign('justify').run(),
  };

  const mappedControlActiveness = {
    bold: () => editor.isActive('bold'),
    italic: () => editor.isActive('italic'),
    strike: () => editor.isActive('strike'),
    underline: () => editor.isActive('underline'),
    code: () => editor.isActive('code'),
    paragraph: () => editor.isActive('paragraph'),
    h1: () => editor.isActive('heading', { level: 1 }),
    h2: () => editor.isActive('heading', { level: 2 }),
    h3: () => editor.isActive('heading', { level: 3 }),
    h4: () => editor.isActive('heading', { level: 4 }),
    h5: () => editor.isActive('heading', { level: 5 }),
    h6: () => editor.isActive('heading', { level: 6 }),
    'bullet-list': () => editor.isActive('bulletList'),
    'ordered-list': () => editor.isActive('orderedList'),
    blockquote: () => editor.isActive('blockquote'),
    link: () => editor.isActive('link'),
    'text-color': () => false,
    'background-color': () => false,
    image: () => false,
    'align-center': () => editor.getAttributes('textStyle').textAlign === 'center',
    'align-right': () => editor.getAttributes('textStyle').textAlign === 'right',
    'align-left': () => editor.getAttributes('textStyle').textAlign === 'left',
    'align-justify': () => editor.getAttributes('textStyle').textAlign === 'justify',
  };
  const onMenuClick = (control: EditorControlTypes) => {
    mappedControlActions[control]();
  };

  const isControlActive = (control: EditorControlTypes): boolean => {
    return mappedControlActiveness[control]();
  };

  return (
    <>
      {EDITOR_MENU_CONTROLS.filter((control) =>
        allowedControls.some((allowedControl) => allowedControl === control.name),
      ).map((control) => (
        <RenderControl
          key={control.name}
          editor={editor}
          control={control}
          onMenuClick={onMenuClick}
          isControlActive={isControlActive}
        />
      ))}
      <MediaExplorer
        open={openMediaExplorer}
        onCloseModal={() => setOpenMediaExplorer(false)}
        onImageChosen={(image) => {
          setOpenMediaExplorer(false);
          const imagePublicUrl = db.storage.from(bucketName).getPublicUrl(image?.mediaHash || '').data.publicUrl;
          editor.commands.setImage({ src: imagePublicUrl, alt: image?.altText, title: image?.altText });
        }}
      />
    </>
  );
}

const RenderControl = ({
  control,
  isControlActive,
  onMenuClick,
  editor,
}: {
  control: MenuControlsType;
  isControlActive: (control: EditorControlTypes) => boolean;
  onMenuClick: (control: EditorControlTypes) => void;
  editor: Editor;
}) => {
  const Item = (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          className={cn('hover:!visio-cms-bg-dark-700', {
            '!visio-cms-bg-dark-800': isControlActive(control.name),
          })}
          value={control.name}
          onClick={() => onMenuClick(control.name)}
        >
          {control.icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{control.title}</TooltipContent>
    </Tooltip>
  );

  switch (control.name) {
    case 'text-color':
      return (
        <TextColorPopOver key={editor.getAttributes('textStyle').color} editor={editor}>
          {Item}
        </TextColorPopOver>
      );
    case 'background-color':
      return (
        <TextColorPopOver key={editor.getAttributes('highlight').color} type="background" editor={editor}>
          {Item}
        </TextColorPopOver>
      );
    case 'link':
      return (
        <LinkPopOver key={editor.getAttributes('link').href} editor={editor}>
          {Item}
        </LinkPopOver>
      );
    default:
      return Item;
  }
};
