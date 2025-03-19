'use client';
import Tiptap from '@/components/ui/tiptap/tiptap';
import { EDITOR_MENU_CONTROLS } from '@/lib/constants';
import useTextEditor from '@/lib/hooks/useTextEditor';
import { EditorControlTypes } from '@/lib/types';
import { getProjectMode } from '@/lib/utils';

export default function RichTextEditorClient({
  allowedControls = [...EDITOR_MENU_CONTROLS.map((control) => control.name)],
  defaultValue,
  propName,
  pageBlockId,
  allowNewLines = true,
}: {
  allowedControls?: EditorControlTypes[];
  defaultValue?: string;
  propName: string;
  pageBlockId: string;
  allowNewLines?: boolean;
}) {
  const { debouncedOnUpdate, isBlockGlobal } = useTextEditor({
    propName,
    defaultValue,
    pageBlockId,
  });

  const projectMode = getProjectMode();
  if (projectMode === 'BUILDER')
    return (
      <Tiptap
        isEditable={!isBlockGlobal}
        allowedControls={allowedControls}
        defaultValue={defaultValue}
        allowNewLines={allowNewLines}
        onChange={(value) => {
          debouncedOnUpdate({ value });
        }}
      />
    );
}
