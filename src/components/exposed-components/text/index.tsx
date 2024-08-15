import Tiptap from '@/components/ui/tiptap/tiptap';
import { EditorControlTypes } from '@/lib/types';
import { sendMessageToParent } from '@/lib/utils';
import { debounce } from 'lodash';

export default function Text({
  allowedControls = [],
  defaultValue,
  propName,
}: {
  allowedControls?: EditorControlTypes[];
  defaultValue?: string;
  propName: string;
}) {
  const debouncedOnUpdate = debounce(({ value }: { value: string }) => {
    sendMessageToParent({ type: 'updateBlockInput', content: JSON.stringify({ path: propName, value }) });
  }, 300);

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
