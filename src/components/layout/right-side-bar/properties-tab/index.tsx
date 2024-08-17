import RepeatersController from './repeaters-controller';
import { Accordion } from '@/components/ui/accordion';

export default function PropertiesTab() {
  return (
    <div>
      <Accordion type="multiple">
        <RepeatersController />
      </Accordion>
    </div>
  );
}
