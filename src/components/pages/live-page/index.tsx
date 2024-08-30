import { usePageContentState } from '@/lib/states/usePageContentState';
import { ProjectConfiguration } from '@/lib/types';
import { PageData } from '@/lib/utils';
import { useEffect } from 'react';

export default function LivePage({
  allowImageTransformation,
  pageBlocks,
  projectConfiguration,
}: {
  allowImageTransformation?: boolean;
  pageBlocks: PageData['pageBlocks'];
  projectConfiguration: PageData['projectConfiguration'] & {
    blocks: ProjectConfiguration['blocks'];
    projectId: string;
  };
}) {
  const { setGlobalBlocks, setTheme, setAllowImageTransformation, setProjectId } = usePageContentState();
  useEffect(() => {
    setAllowImageTransformation(allowImageTransformation || false);
    setGlobalBlocks(projectConfiguration.globalBlocks);
    setTheme(projectConfiguration.theme);
    setProjectId(projectConfiguration.projectId);

  }, [
    setAllowImageTransformation,
    setGlobalBlocks,
    setTheme,
    allowImageTransformation,
    projectConfiguration,
    setProjectId,
  ]);

  return (
    <>
      {pageBlocks?.map((block) => {
        const Block = projectConfiguration.blocks.find((b) => b.Schema.id === block.blockId);
        if (!Block) return null;
        return <Block key={block.id} {...block.inputs} />;
      })}
    </>
  );
}
