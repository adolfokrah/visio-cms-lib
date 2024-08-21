import usePageContent from '@/lib/hooks/usePageContent';
import { usePageContentState } from '@/lib/states/usePageContentState';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import { useTabState } from '@/lib/states/useTabsState';
import React from 'react';

export default function GlobalEditContent() {
  const { tabs } = useTabState();
  const { blocks } = useProjectConfigurationState();
  const { globalBlocks } = usePageContentState();
  usePageContent();
  const pinnedTab = tabs.find((tab) => tab.active);
  const foundGlobalBlock = globalBlocks.find((globalBlock) => globalBlock.id === pinnedTab?.id);
  const block = blocks.find((block) => block.Schema.id === foundGlobalBlock?.blockId);
  if (!block || !foundGlobalBlock) return null;

  return (
    <div>
      {React.createElement(block, {
        key: block.Schema.id,
        ...(foundGlobalBlock.inputs || block.Schema.defaultPropValues),
        pageBlockId: foundGlobalBlock.id,
      })}
    </div>
  );
}
