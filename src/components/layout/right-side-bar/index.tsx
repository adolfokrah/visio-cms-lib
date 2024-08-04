import { usePagesState } from '@/lib/states/usePagesState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import PageSettingsTab from './page-settings-tab';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

export default function RightSideBar() {
  const { pages } = usePagesState();

  const activePage = useMemo(() => pages.find((page) => page.active), [pages]);
  return (
    <div className="visio-cms-h-screen visio-cms-animate-fade-in visio-cms-bg-dark-800 visio-cms-pt-[50px] visio-cms-px-2">
      <Tabs defaultValue="properties" className="visio-cms-w-full">
        <TabsList
          className={cn('visio-cms-grid visio-cms-w-full visio-cms-grid-cols-2', {
            '!visio-cms-grid-cols-3': activePage != null,
          })}
        >
          <TabsTrigger value="properties">Properties</TabsTrigger>
          {activePage && <TabsTrigger value="page">Page</TabsTrigger>}
          <TabsTrigger value="theme">Theme</TabsTrigger>
        </TabsList>
        <TabsContent value="properties">d</TabsContent>
        {activePage && (
          <TabsContent value="page">
            <PageSettingsTab />
          </TabsContent>
        )}
        <TabsContent value="theme">Sections.</TabsContent>
      </Tabs>
    </div>
  );
}
