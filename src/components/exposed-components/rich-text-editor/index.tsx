import Tiptap from '@/components/ui/tiptap/tiptap';
import useTextEditor from '@/lib/hooks/useTextEditor';
import { EditorControlTypes } from '@/lib/types';

export default function RichTextEditor({
  allowedControls = [],
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
      allowNewLines={false}
      onChange={(value) => {
        debouncedOnUpdate({ value });
      }}
    />
  );
}
