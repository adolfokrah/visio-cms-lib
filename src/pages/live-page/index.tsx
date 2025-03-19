import { Page } from '@/lib/states/usePagesState';
import { ProjectConfiguration } from '@/lib/types';
import { extractBlockData, PageData } from '@/lib/utils';
import Client from './client';

export default function LivePage({
  allowImageTransformation,
  pageBlocks,
  projectConfiguration,
  params,
  pages,
}: {
  allowImageTransformation?: boolean;
  pageBlocks: PageData['pageBlocks'];
  params: PageData['params'];
  pages: Page[];
  projectConfiguration: Omit<PageData['projectConfiguration'], 'scripts'> & {
    blocks: ProjectConfiguration['blocks'];
    projectId: string;
  };
}) {
  return (
    <>
      <Client
        allowImageTransformation={allowImageTransformation}
        projectConfiguration={{
          ...projectConfiguration,
          projectId: projectConfiguration.projectId,
          blocks: projectConfiguration.blocks,
        }}
        params={params}
        pages={pages}
      />
      {pageBlocks?.map((block) => {
        const globalBlock = projectConfiguration?.globalBlocks?.find((b) => b.id === block?.globalBlockId);
        const Block = projectConfiguration.blocks.find((b) => b.id === (globalBlock?.blockId || block.blockId));
        if (!Block) return null;
        const Component = Block.component;
        const inputs = {
          ...Block.defaultPropValues,
          ...block.inputs,
          ...globalBlock?.inputs,
          externalData: extractBlockData({ ...params?.externalData }, block.id) ,
        };
        return <Component key={block.id} {...inputs} />;
      })}
    </>
  );
}
