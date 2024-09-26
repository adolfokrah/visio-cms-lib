import { useEffect, useState } from 'react';
import { getPageBlocks, PageData } from './lib/utils';
import { LivePage } from './components';
import { PageBlock } from './lib/states/usePagesState';
import blocks from './components/blocks';
import visioConfig from '../visio.config';

export default function TestLivePage() {
  const [pageBlocks, setPageBlocks] = useState<PageBlock[]>([]);
  const [projectConfiguration, setProjectConfiguration] = useState<PageData['projectConfiguration'] | null>(null);
  const [params, setParams] = useState<PageData['params']>({});
  const [pages, setPages] = useState<PageData['pages']>([]);

  useEffect(() => {
    const path = window.location.pathname;

    (async () => {
      const data = await getPageBlocks(
        path,
        visioConfig.supabaseAnonKey,
        visioConfig.supabaseProjectUrl,
        visioConfig.defaultLanguage.locale,
      );

      if (data && !data.error) {
        setPageBlocks(data.pageBlocks);
        setProjectConfiguration(data.projectConfiguration);
        setParams(data.params);
        setPages(data.pages);
      }
    })();
  }, []);

  if (!projectConfiguration) return <div>Loading...</div>;
  return (
    <LivePage
      allowImageTransformation={false}
      pageBlocks={pageBlocks}
      projectConfiguration={{
        ...projectConfiguration,
        projectId: visioConfig.projectId,
        blocks,
      }}
      params={params}
      pages={pages}
    />
  );
}
