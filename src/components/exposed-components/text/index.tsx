import React from 'react';
import useTextEditor from '@/lib/hooks/useTextEditor';
import { EditorControlTypes } from '@/lib/types';
import { getProjectMode, removeHtmlTags } from '@/lib/utils';
const Tiptap = React.lazy(() => import('@/components/ui/tiptap/tiptap'));

export type TextEditorControls = Exclude<
  EditorControlTypes,
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'bullet-list' | 'ordered-list' | 'blockquote' | 'image'
>;

export default function Text({
  defaultValue,
  propName,
  pageBlockId,
}: {
  defaultValue?: string;
  propName: string;
  pageBlockId: string;
}) {
  const { debouncedOnUpdate, isBlockGlobal, html } = useTextEditor({
    propName,
    defaultValue,
    pageBlockId,
  });

  const projectMode = getProjectMode();
  if (projectMode === 'BUILDER')
    return (
      <React.Suspense fallback={<></>}>
        <Tiptap
          isEditable={!isBlockGlobal}
          allowedControls={[]}
          defaultValue={defaultValue}
          allowNewLines={false}
          onChange={(value) => {
            debouncedOnUpdate({ value });
          }}
        />
      </React.Suspense>
    );
  else return removeHtmlTags(html);
}
