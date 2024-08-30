import { useEffect, useState } from 'react';
import { getPageBlocks, PageData } from './lib/utils';
import { LivePage } from './components';
import { PageBlock } from './lib/states/usePagesState';
import blocks from './components/blocks';

export default function TestLivePage() {
  const [pageBlocks, setPageBlocks] = useState<PageBlock[]>([]);
  const [projectConfiguration, setProjectConfiguration] = useState<PageData['projectConfiguration'] | null>(null);

  useEffect(() => {
    (async () => {
      const data = await getPageBlocks(
        '/about-2-page',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyaHZyZmF0cG1kYnd0dG90bHdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI0MTIyNDAsImV4cCI6MjAzNzk4ODI0MH0.6oTSoUtEAVdSxUa4ws9PgXEnHCiFCsgXTawwbtOBDh8',
        'https://urhvrfatpmdbwttotlwc.supabase.co',
        'en-us',
      );
      if (data) {
        setPageBlocks(data.pageBlocks);
        setProjectConfiguration(data.projectConfiguration);
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
        projectId: 'urhvrfatpmdbwttotlwc',
        blocks,
      }}
    />
  );
}
