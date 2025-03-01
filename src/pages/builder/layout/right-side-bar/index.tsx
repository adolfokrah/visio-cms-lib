import { usePagesState } from '@/lib/states/usePagesState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageSettingsTab from './page-settings-tab';
import { useMemo } from 'react';
import { cn, getSelectedBlock } from '@/lib/utils';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import PropertiesTab from './properties-tab';
import { useTabState } from '@/lib/states/useTabsState';
import ProjectSettingsTab from './project-settings-tab';

export default function RightSideBar() {
  const { pages } = usePagesState();
  const { globalBlocks } = useProjectConfigurationState();
  const { tabs } = useTabState();
  const activePage = useMemo(() => pages.find((page) => page.active), [pages]);
  const pageBlocks = activePage?.blocks?.[activePage.activeLanguageLocale];
  const selectedBlock = getSelectedBlock(pageBlocks);
  const globalBlock = globalBlocks.find((block) => block.id === selectedBlock?.globalBlockId);
  const activeGlobalPinnedBlock = globalBlocks.find((block) => block.id === tabs.find((tab) => tab.active)?.id);

  return (
    <div className="visio-cms-h-screen visio-cms-animate-fade-in visio-cms-bg-dark-800 visio-cms-pt-[50px] ">
      <Tabs defaultValue={'properties'} className="visio-cms-w-full">
        <TabsList
          className={cn('visio-cms-grid visio-cms-w-[95%] visio-cms-grid-cols-1 visio-cms-mx-auto', {
            'visio-cms-grid-cols-3': activePage != null && globalBlock == null && selectedBlock,
            'visio-cms-grid-cols-2': activePage != null || activeGlobalPinnedBlock != null,
          })}
        >
          {((selectedBlock && !globalBlock) || activeGlobalPinnedBlock) && (
            <TabsTrigger value="properties">Properties</TabsTrigger>
          )}
          {activePage && <TabsTrigger value="page">Page</TabsTrigger>}
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        {!globalBlock && (
          <TabsContent value="properties">
            <PropertiesTab />
          </TabsContent>
        )}
        {activePage && (
          <TabsContent value="page">
            <div className="visio-cms-px-2">
              <PageSettingsTab />
            </div>
          </TabsContent>
        )}
        <TabsContent value="settings">
          <div className="visio-cms-px-2">
            <ProjectSettingsTab />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
