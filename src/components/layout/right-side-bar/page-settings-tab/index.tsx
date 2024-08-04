import PageAttributes from './page-attributes';
import PageStatusAndVisibility from './page-status-and-visibility';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function PageSettingsTab() {
  const accordionValues = ['page-and-visibility', 'page-attributes'];
  return (
    <Accordion type="multiple" defaultValue={accordionValues}>
      <AccordionItem value={accordionValues[0]}>
        <AccordionTrigger>Status & Visibility</AccordionTrigger>
        <AccordionContent>
          <PageStatusAndVisibility />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value={accordionValues[1]}>
        <AccordionTrigger>Page attributes</AccordionTrigger>
        <AccordionContent>
          <PageAttributes />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
