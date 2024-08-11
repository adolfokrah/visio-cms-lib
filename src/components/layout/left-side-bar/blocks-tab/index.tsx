import { useBlocksTabState } from '@/lib/states/useBlocksTabState';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import { Block } from '@/lib/types';
import { groupBlocks } from '@/lib/utils';
import { Box, Folder, FolderOpen } from 'lucide-react';

export default function BlocksTab() {
  const { blocks } = useProjectConfigurationState();
  const groupedBlocks = groupBlocks(blocks);
  const { expandedGroups, setExpandedGroups } = useBlocksTabState();
  return (
    <>
      {groupedBlocks
        .filter((group) => group.groupName != 'Ungrouped')
        .map(({ groupName, blocks }) => (
          <div key={groupName}>
            <div
              className="visio-cms-flex visio-cms-gap-2 visio-cms-p-3 visio-cms-rounded-md visio-cms-cursor-pointer hover:visio-cms-bg-dark-700"
              onClick={() => {
                if (expandedGroups.includes(groupName)) {
                  setExpandedGroups(expandedGroups.filter((group) => group != groupName));
                } else {
                  setExpandedGroups([...expandedGroups, groupName]);
                }
              }}
            >
              {expandedGroups.includes(groupName) ? <FolderOpen size={14} /> : <Folder fill="white" size={14} />}
              {groupName}
            </div>
            <>
              {expandedGroups.includes(groupName) && (
                <>
                  {blocks.map((BlockComponent, index) => (
                    <div className="visio-cms-pl-2" key={index}>
                      <BlockItem BlockComponent={BlockComponent} />
                    </div>
                  ))}
                </>
              )}
            </>
          </div>
        ))}

      <>
        {groupedBlocks
          .find((group) => group.groupName == 'Ungrouped')
          ?.blocks.map((BlockComponent, index) => (
            <div key={index}>
              <BlockItem BlockComponent={BlockComponent} />
            </div>
          ))}
      </>
    </>
  );
}

function BlockItem({ BlockComponent }: { BlockComponent: Block<Record<string, any>> }) {
  return (
    <div className="visio-cms-p-3 visio-cms-rounded-md visio-cms-cursor-pointer visio-cms-flex visio-cms-gap-2 hover:visio-cms-bg-dark-700">
      <Box size={14} />
      {BlockComponent.Schema.name}
    </div>
  );
}
