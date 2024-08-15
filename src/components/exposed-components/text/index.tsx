import Tiptap from '@/components/ui/tiptap/tiptap';
import useTextEditor from '@/lib/hooks/useTextEditor';
import { EditorControlTypes } from '@/lib/types';

export type TextEditorControls = Exclude<
  EditorControlTypes,
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'bullet-list' | 'ordered-list' | 'blockquote' | 'image'
>;

export default function Text({
  allowedControls = [],
  defaultValue,
  propName,
}: {
  allowedControls?: TextEditorControls[];
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
