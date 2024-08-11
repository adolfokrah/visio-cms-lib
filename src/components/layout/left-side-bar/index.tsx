import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import BlocksTab from './blocks-tab';
import LayersTab from './layers-tab';
import PagesTab from './page-tab';

export default function LeftSideBar() {
  return (
    <div className="visio-cms-h-screen visio-cms-animate-slide-from-left visio-cms-bg-dark-800 visio-cms-pt-[50px] visio-cms-px-2">
      <Tabs defaultValue="pages" className="visio-cms-w-full">
        <TabsList className="visio-cms-grid visio-cms-w-full visio-cms-grid-cols-3">
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="layers">Layers</TabsTrigger>
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
