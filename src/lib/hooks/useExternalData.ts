import { useEffect, useState } from 'react';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import { getBlockExternalData } from '../utils';
import { PageBlock } from '../exposed-types';
import { GlobalBlock } from '../types';
import { usePageContentState } from '../states/usePageContentState';

export const useExternalData = (pageSlug: string, pageBlocks: PageBlock[] | GlobalBlock[]) => {
  const { blocks, routeHandlers } = useProjectConfigurationState();
  const {blocks: newBlocks} = usePageContentState();
  const [externalData, setExternalData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchExternalData = async () => {
      try {
          let data = {}
        if (routeHandlers && pageSlug.length) {
          setLoading(true);
          const res = await routeHandlers(`${pageSlug}`);
          if (res) {
            data = res;
          }else{
            data = {title: 'No data and something shit'}
          }
        }

        const b = newBlocks.length ? newBlocks : blocks
        const d = await getBlockExternalData(pageBlocks, b,  externalData);

       
        setExternalData({...data, ...d});
        setLoading(false);
      } catch (error) {
        throw new Error('Error fetching external data');
      } finally {
        setLoading(false);
      }
    };


    fetchExternalData();
  }, [routeHandlers, pageSlug, blocks.length, pageBlocks.length]);

  return { externalData, loading };
};
