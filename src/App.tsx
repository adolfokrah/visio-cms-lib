import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Textarea,
  RadioGroup,
  RadioGroupItem,
  Label,
  TagInput,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ImageBox,
} from './components';
import './styles/tailwind.css';

function App() {
  return (
    <>
      <div className="visio-cms-w-96 visio-cms-m-auto visio-cms-mt-7 visio-cms-p-10 visio-cms-bg-dark-800 visio-cms-rounded-md visio-cms-border visio-cms-border-dark-700">
        <Tabs defaultValue="account">
          <TabsList className="visio-cms-grid visio-cms-w-full visio-cms-grid-cols-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Input placeholder="Enter email here" />
            <br />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <br />
            <Button className="visio-cms-w-full">click me</Button>
          </TabsContent>
          <TabsContent value="password">
            <p className="visio-cms-text-xs visio-cms-font-regular">Change your password here.</p>
          </TabsContent>
        </Tabs>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
          </AccordionItem>
        </Accordion>
        <br />

        <Textarea />

        <br />
        <RadioGroup defaultValue="option-one">
          <div className="visio-cms-flex visio-cms-items-center visio-cms-space-x-2">
            <RadioGroupItem value="option-one" id="option-one" />
            <Label htmlFor="option-one">Option One</Label>
          </div>
          <div className="visio-cms-flex visio-cms-items-center visio-cms-space-x-2">
            <RadioGroupItem value="option-two" id="option-two" />
            <Label htmlFor="option-two">Option Two</Label>
          </div>
        </RadioGroup>
        <br />
        <TagInput />
        <br />
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <br />
        <Popover>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent side="left" sideOffset={44}>
            Place content for the popover here.
          </PopoverContent>
        </Popover>
        <br />
        <ImageBox imageSrc="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/56ea7a88086043.5dcbbc76bb324.jpg" />
      </div>
    </>
  );
}

export default App;
