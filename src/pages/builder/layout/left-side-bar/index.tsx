import { useTabState } from '@/lib/states/useTabsState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BlocksTab from './blocks-tab';
import LayersTab from './layers-tab';
import PagesTab from './page-tab';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import { cn } from '@/lib/utils';

export default function LeftSideBar() {
  const { globalBlocks } = useProjectConfigurationState();
  const { tabs } = useTabState();
  const activeGlobalPinnedBlock = globalBlocks.find((block) => block.id === tabs.find((tab) => tab.active)?.id);
  return (
    <div className="visio-cms-h-screen visio-cms-animate-slide-from-left visio-cms-bg-dark-800 visio-cms-pt-[50px] visio-cms-px-2">
      <Tabs defaultValue="pages" className="visio-cms-w-full">
        <TabsList
          className={cn('visio-cms-grid visio-cms-w-full', {
            'visio-cms-grid-cols-2': activeGlobalPinnedBlock != null,
            'visio-cms-grid-cols-3': activeGlobalPinnedBlock == null,
          })}
        >
          <TabsTrigger value="pages">Pages</TabsTrigger>
          {!activeGlobalPinnedBlock && (
            <>
              <TabsTrigger value="layers">Layers</TabsTrigger>
            </>
          )}
          <TabsTrigger value="blocks">Blocks</TabsTrigger>
        </TabsList>
        <TabsContent value="pages">
          <PagesTab />
        </TabsContent>
        <TabsContent value="layers">
          <LayersTab />
        </TabsContent>
        <TabsContent value="blocks">
          <BlocksTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
