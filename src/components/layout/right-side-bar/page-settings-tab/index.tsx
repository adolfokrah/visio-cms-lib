import PageAttributes from './page-attributes';
import PageStatusAndVisibility from './page-status-and-visibility';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SeoMeta from './seo-meta';

export default function PageSettingsTab() {
  const accordionValues = ['page-and-visibility', 'page-attributes', 'seo'];
  return (
    <div className="visio-cms-overflow-auto visio-cms-h-[calc(100vh-100px)] scrollbar-custom  visio-cms-px-1">
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

        <AccordionItem value={accordionValues[2]}>
          <AccordionTrigger>SEO (META)</AccordionTrigger>
          <AccordionContent>
            <SeoMeta />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
