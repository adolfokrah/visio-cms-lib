import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Tabs, TabsTrigger, TabsList } from '@/components/ui/tabs';
import { SchedulePublished, Status, usePagesState } from '@/lib/states/usePagesState';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCallback, useMemo } from 'react';
import { DatePicker } from '@/components/ui/date-picker';

export default function PageStatusAndVisibility() {
  const { pages, setPages } = usePagesState();
  const page = useMemo(() => pages.find((page) => page.active), [pages]);

  const updatePageStatus = useCallback(
    (value: Status) => {
      setPages(pages.map((page) => ({ ...page, status: page.active ? (value as Status) : page.status })));
    },
    [pages, setPages],
  );

  const updateSchedulePublished = useCallback(
    (value: SchedulePublished) => {
      setPages(
        pages.map((page) => ({
          ...page,
          schedulePublished: page.active ? (value as SchedulePublished) : page.schedulePublished,
        })),
      );
    },
    [pages, setPages],
  );

  const handleUpdatePageDate = useCallback(
    (value: Date) => {
      setPages(
        pages.map((page) => ({
          ...page,
          publishDate: page.active ? (value as Date) : page.publishDate,
        })),
      );
    },
    [pages, setPages],
  );

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="page-and-visibility">
        <AccordionTrigger>Status & Visibility</AccordionTrigger>
        <AccordionContent>
          <Label className="!visio-cms-text-gray-300">Status</Label>
          <Tabs
            value={page?.status}
            className="visio-cms-w-full visio-cms-mt-3"
            onValueChange={(value) => updatePageStatus(value as Status)}
          >
            <TabsList className="visio-cms-grid visio-cms-w-full visio-cms-grid-cols-2">
              <TabsTrigger value="Draft">Draft</TabsTrigger>
              <TabsTrigger value="Publish">Publish</TabsTrigger>
            </TabsList>
          </Tabs>
          {page?.status == 'Publish' && (
            <div className="visio-cms-my-3">
              <Label className="!visio-cms-text-gray-300">Schedule published</Label>
              <div className="visio-cms-my-3">
                <RadioGroup
                  value={page?.schedulePublished}
                  onValueChange={(value) => {
                    updateSchedulePublished(value as SchedulePublished);
                  }}
                >
                  <div className="visio-cms-flex visio-cms-items-center visio-cms-space-x-2">
                    <RadioGroupItem value="Now" id="Now" />
                    <Label htmlFor="Now">Now</Label>
                  </div>
                  <div className="visio-cms-flex visio-cms-items-center visio-cms-space-x-2">
                    <RadioGroupItem value="Later" id="Later" />
                    <Label htmlFor="Later">Later</Label>
                  </div>
                </RadioGroup>
              </div>
              {page?.schedulePublished === 'Later' && (
                <>
                  <Label className="!visio-cms-text-gray-300">Date & Time</Label>
                  <div className="visio-cms-my-3">
                    <DatePicker
                      key={`${page?.publishDate}`}
                      selectedDate={page?.publishDate}
                      onSelect={handleUpdatePageDate}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
