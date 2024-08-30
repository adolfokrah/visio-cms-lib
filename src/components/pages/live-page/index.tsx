import { usePageContentState } from '@/lib/states/usePageContentState';
import { useParamState } from '@/lib/states/useParamState';
import { ProjectConfiguration } from '@/lib/types';
import { PageData } from '@/lib/utils';
import { useEffect } from 'react';

export default function LivePage({
  allowImageTransformation,
  pageBlocks,
  projectConfiguration,
  params,
}: {
  allowImageTransformation?: boolean;
  pageBlocks: PageData['pageBlocks'];
  params: PageData['params'];
  projectConfiguration: PageData['projectConfiguration'] & {
    blocks: ProjectConfiguration['blocks'];
    projectId: string;
  };
}) {
  const { setGlobalBlocks, setTheme, setAllowImageTransformation, setProjectId } = usePageContentState();
  const { setParams } = useParamState();
  useEffect(() => {
    setAllowImageTransformation(allowImageTransformation || false);
    setGlobalBlocks(projectConfiguration.globalBlocks);
    setTheme(projectConfiguration.theme);
    setProjectId(projectConfiguration.projectId);
    setParams(params);
  }, [
    setAllowImageTransformation,
    setGlobalBlocks,
    setTheme,
    allowImageTransformation,
    projectConfiguration,
    setProjectId,
    setParams,
    params,
  ]);

  return (
    <>
      {pageBlocks?.map((block) => {
        const globalBlock = projectConfiguration?.globalBlocks?.find((b) => b.id === block?.globalBlockId);

        const Block = projectConfiguration.blocks.find((b) => b.Schema.id === (globalBlock?.blockId || block.blockId));
        if (!Block) return null;
        const inputs = { ...Block.Schema.defaultPropValues, ...block.inputs, ...globalBlock?.inputs };
        return <Block key={block.id} {...inputs} />;
      })}
    </>
  );
}
