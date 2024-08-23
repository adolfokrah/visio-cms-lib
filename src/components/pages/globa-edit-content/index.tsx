import usePageContent from '@/lib/hooks/usePageContent';
import { usePageContentState } from '@/lib/states/usePageContentState';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import { sendMessageToParent } from '@/lib/utils';
import React from 'react';

export default function GlobalEditContent() {
  const { blocks } = useProjectConfigurationState();
  const { globalBlocks, tabs } = usePageContentState();
  usePageContent();
  const pinnedTab = tabs.find((tab) => tab.active);
  const foundGlobalBlock = globalBlocks.find((globalBlock) => globalBlock.id === pinnedTab?.id);
  const block = blocks.find((block) => block.Schema.id === foundGlobalBlock?.blockId);
  if (!block || !foundGlobalBlock) return null;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        sendMessageToParent({ type: 'remove-selected-repeater', content: '' });
      }}
    >
      {React.createElement(block, {
        key: block.Schema.id,
        ...(foundGlobalBlock.inputs || block.Schema.defaultPropValues),
        pageBlockId: foundGlobalBlock.id,
      })}
    </div>
  );
}
