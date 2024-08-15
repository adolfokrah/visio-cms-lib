import Tiptap from '@/components/ui/tiptap/tiptap';
import { EDITOR_MENU_CONTROLS } from '@/lib/constants';
import useTextEditor from '@/lib/hooks/useTextEditor';
import { EditorControlTypes } from '@/lib/types';

export default function RichTextEditor({
  allowedControls = [...EDITOR_MENU_CONTROLS.map((control) => control.name)],
  defaultValue,
  propName,
}: {
  allowedControls?: EditorControlTypes[];
  defaultValue?: string;
  propName: string;
}) {
  const { html, debouncedOnUpdate, globalBlock } = useTextEditor({ propName, defaultValue });

  if (globalBlock) {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }

  return (
    <Tiptap
      allowedControls={allowedControls}
      defaultValue={defaultValue}
      allowNewLines={true}
      onChange={(value) => {
        debouncedOnUpdate({ value });
      }}
    />
  );
}
