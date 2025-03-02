import { useEffect, useState } from 'react';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
export const useExternalData = (pageSlug: string) => {
  const { blocks, routeHandlers } = useProjectConfigurationState();
  const [externalData, setExternalData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchExternalData = async () => {
      try {
        if (routeHandlers && pageSlug) {
          setLoading(true);
          const data = await routeHandlers(`${pageSlug}`);
          if (data) {
            setExternalData(data);
          }
        }
        setLoading(false);
      } catch (error) {
        throw new Error('Error fetching external data');
      } finally {
        setLoading(false);
      }
    };

    fetchExternalData();
  }, [routeHandlers, pageSlug, blocks.length]);

  return { externalData, loading };
};
