import { Page } from '@/lib/states/usePagesState';
import { ProjectConfiguration } from '@/lib/types';
import { PageData } from '@/lib/utils';
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
        const Block = projectConfiguration.blocks.find((b) => b.Schema.id === (globalBlock?.blockId || block.blockId));
        if (!Block) return null;
        const inputs = {
          ...Block.Schema.defaultPropValues,
          ...block.inputs,
          ...globalBlock?.inputs,
          externalData: { ...params?.externalData },
        };
        return <Block key={block.id} {...inputs} />;
      })}
    </>
  );
}
