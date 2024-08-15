import Tiptap from '@/components/ui/tiptap/tiptap';
import { EditorControlTypes } from '@/lib/types';

export default function Text({
  allowedControls = [],
  defaultValue,
}: {
  allowedControls?: EditorControlTypes[];
  defaultValue?: string;
  propName: string;
}) {
  return (
    <Tiptap
      allowedControls={allowedControls}
      defaultValue={defaultValue}
      allowNewLines={false}
      onChange={(value) => {
        console.log(value);
      }}
    />
  );
}
