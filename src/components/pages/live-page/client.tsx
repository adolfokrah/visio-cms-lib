import { usePageContentState } from '@/lib/states/usePageContentState';
import { Page } from '@/lib/states/usePagesState';
import { useParamState } from '@/lib/states/useParamState';
import { ProjectConfiguration } from '@/lib/types';
import { PageData } from '@/lib/utils';
import { useEffect } from 'react';

export default function Client({
  allowImageTransformation,
  projectConfiguration,
  params,
  pages,
}: {
  allowImageTransformation?: boolean;
  params: PageData['params'];
  pages: Page[];
  projectConfiguration: Omit<PageData['projectConfiguration'], 'scripts'> & {
    blocks: ProjectConfiguration['blocks'];
    projectId: string;
  };
}) {
  const { setGlobalBlocks, setTheme, setBlocks, blocks, setAllowImageTransformation, setProjectId, setPages } =
    usePageContentState();
  const { setParams } = useParamState();
  useEffect(() => {
    setAllowImageTransformation(allowImageTransformation || false);
    setGlobalBlocks(projectConfiguration.globalBlocks);
    setTheme(projectConfiguration.theme);
    setProjectId(projectConfiguration.projectId);
    setParams(params);
    setPages(pages);
    setBlocks(projectConfiguration.blocks);
  }, [
    setAllowImageTransformation,
    setGlobalBlocks,
    setTheme,
    allowImageTransformation,
    projectConfiguration,
    setProjectId,
    setParams,
    params,
    pages,
    setPages,
    setBlocks,
  ]);

  if (blocks.length < 1) return null;

  return null
}
