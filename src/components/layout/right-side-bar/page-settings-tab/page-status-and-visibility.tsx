import { Label } from '@/components/ui/label';
import { Tabs, TabsTrigger, TabsList } from '@/components/ui/tabs';
import { SchedulePublished, Status } from '@/lib/states/usePagesState';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DatePicker } from '@/components/ui/date-picker';
import usePageSettings from '@/lib/hooks/usePageSettings';

export default function PageStatusAndVisibility() {
  const { handleUpdatePageDate, updateSchedulePublished, updatePageStatus, page } = usePageSettings();

  return (
    <>
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
        <div className="visio-cms-mt-3 visio-cms-hidden">
          <Label className="!visio-cms-text-gray-300">Schedule published</Label>
          <div className="visio-cms-my-3">
            <RadioGroup
              value={page?.schedulePublished || ''}
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
                  selectedDate={page?.publishDate || new Date()}
                  onSelect={handleUpdatePageDate}
                  disabled={{ before: new Date() }}
                />
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
