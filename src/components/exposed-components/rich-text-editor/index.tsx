import Tiptap from '@/components/ui/tiptap/tiptap';
import { EDITOR_MENU_CONTROLS } from '@/lib/constants';
import useTextEditor from '@/lib/hooks/useTextEditor';
import { EditorControlTypes } from '@/lib/types';

export default function RichTextEditor({
  allowedControls = [...EDITOR_MENU_CONTROLS.map((control) => control.name)],
  defaultValue,
  propName,
  pageBlockId,
}: {
  allowedControls?: EditorControlTypes[];
  defaultValue?: string;
  propName: string;
  pageBlockId: string;
}) {
  const { debouncedOnUpdate, isBlockGlobal } = useTextEditor({
    propName,
    defaultValue,
    pageBlockId,
  });

  return (
    <Tiptap
      isEditable={!isBlockGlobal}
      allowedControls={allowedControls}
      defaultValue={defaultValue}
      allowNewLines={true}
      onChange={(value) => {
        debouncedOnUpdate({ value });
      }}
    />
  );
}
