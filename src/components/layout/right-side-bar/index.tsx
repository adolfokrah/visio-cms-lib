import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';

export default function RightSideBar() {
  return (
    <div className="visio-cms-h-screen visio-cms-animate-slide-from-right visio-cms-bg-dark-800 visio-cms-pt-[50px] visio-cms-px-2">
      <Tabs defaultValue="properties" className="visio-cms-w-full">
        <TabsList className="visio-cms-grid visio-cms-w-full visio-cms-grid-cols-3">
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="page">Page</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
        </TabsList>
        <TabsContent value="properties">Make changes to your account here.</TabsContent>
        <TabsContent value="page">Change your password here.</TabsContent>
        <TabsContent value="theme">Sections.</TabsContent>
      </Tabs>
    </div>
  );
}
