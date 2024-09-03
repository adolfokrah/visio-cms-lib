import { Label } from '@/components/ui/label';
import { Tabs, TabsTrigger, TabsList } from '@/components/ui/tabs';
import { Status, usePagesState } from '@/lib/states/usePagesState';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import usePageSettings from '@/lib/hooks/usePageSettings';

export default function PageStatusAndVisibility() {
  const { handleUpdatePageDate, updatePageStatus, page } = usePageSettings();
  const { pages } = usePagesState();
  const activePage = pages.find((page) => page.active);
  const activeLanguage = activePage?.activeLanguageLocale ?? '';

  return (
    <>
      <Label className="!visio-cms-text-gray-300">Status</Label>
      <Tabs
        value={['Publish', 'Schedule'].includes(page?.status?.[activeLanguage] || 'Draft') ? 'Publish' : 'Draft'}
        className="visio-cms-w-full visio-cms-mt-3"
        onValueChange={(value) => updatePageStatus(value as Status)}
      >
        <TabsList className="visio-cms-grid visio-cms-w-full visio-cms-grid-cols-2">
          <TabsTrigger value="Draft">Draft</TabsTrigger>
          <TabsTrigger value="Publish">Publish</TabsTrigger>
        </TabsList>
      </Tabs>
      {['Publish', 'Schedule'].includes(page?.status?.[activeLanguage] || 'Draft') && (
        <div className="visio-cms-mt-3 ">
          <Label className="!visio-cms-text-gray-300">Schedule published</Label>
          <div className="visio-cms-my-3">
            <RadioGroup
              value={page?.status?.[activeLanguage] || ''}
              onValueChange={(value) => {
                updatePageStatus(value as Status);
              }}
            >
              <div className="visio-cms-flex visio-cms-items-center visio-cms-space-x-2">
                <RadioGroupItem value="Publish" id="publish" />
                <Label htmlFor="publish">Now</Label>
              </div>
              <div className="visio-cms-flex visio-cms-items-center visio-cms-space-x-2">
                <RadioGroupItem value="Schedule" id="schedule" />
                <Label htmlFor="schedule">Later</Label>
              </div>
            </RadioGroup>
          </div>
          {page?.status?.[activeLanguage] === 'Schedule' && (
            <>
              <Label className="!visio-cms-text-gray-300">Date & Time</Label>
              <div className="visio-cms-my-3">
                <DateTimePicker
                  disabledDays={{ before: new Date() }}
                  hourCycle={12}
                  value={page?.publishDate || new Date()}
                  onChange={(date) => {
                    if (page?.publishDate != date) {
                      if (date) {
                        handleUpdatePageDate(date);
                      }
                    }
                  }}
                />
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
