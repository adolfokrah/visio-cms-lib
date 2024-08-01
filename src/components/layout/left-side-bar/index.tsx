import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';

export default function LeftSideBar() {
  return (
    <div className="visio-cms-h-screen visio-cms-animate-slide-from-left visio-cms-bg-dark-800 visio-cms-pt-[50px] visio-cms-px-2">
      <Tabs defaultValue="pages" className="visio-cms-w-full">
        <TabsList className="visio-cms-grid visio-cms-w-full visio-cms-grid-cols-3">
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="layers">Layers</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
        </TabsList>
        <TabsContent value="pages">Make changes to your account here.</TabsContent>
        <TabsContent value="layers">Change your password here.</TabsContent>
        <TabsContent value="sections">Sections.</TabsContent>
      </Tabs>
    </div>
  );
}
