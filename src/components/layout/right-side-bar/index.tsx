import { usePagesState } from '@/lib/states/usePagesState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import PageSettingsTab from './page-settings-tab';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import ThemeTab from './theme-tab';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import PropertiesTab from './properties-tab';

export default function RightSideBar() {
  const { pages } = usePagesState();
  const { globalBlocks } = useProjectConfigurationState();
  const activePage = useMemo(() => pages.find((page) => page.active), [pages]);
  const pageBlocks = activePage?.blocks?.[activePage.activeLanguageLocale];
  const selectedBlock = pageBlocks?.find((block) => block.isSelected);
  const globalBlock = globalBlocks.find((block) => block.id === selectedBlock?.globalBlockId);

  return (
    <div className="visio-cms-h-screen visio-cms-animate-fade-in visio-cms-bg-dark-800 visio-cms-pt-[50px] visio-cms-px-2">
      <Tabs defaultValue={'properties'} className="visio-cms-w-full">
        <TabsList
          className={cn('visio-cms-grid visio-cms-w-full visio-cms-grid-cols-2', {
            'visio-cms-grid-cols-3': activePage != null && globalBlock == null,
          })}
        >
          {!globalBlock && <TabsTrigger value="properties">Properties</TabsTrigger>}
          {activePage && <TabsTrigger value="page">Page</TabsTrigger>}
          <TabsTrigger value="theme">Theme</TabsTrigger>
        </TabsList>
        <TabsContent value="properties">
          <PropertiesTab />
        </TabsContent>
        {activePage && (
          <TabsContent value="page">
            <PageSettingsTab />
          </TabsContent>
        )}
        <TabsContent value="theme">
          <ThemeTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
