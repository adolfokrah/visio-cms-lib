import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Theme from './theme';
import ScriptTag from './scripts';
import { HTML_SECTIONS } from '@/lib/constants';

export default function ProjectSettingsTab() {
  return (
    <div className="visio-cms-overflow-auto visio-cms-h-[calc(100vh-100px)] scrollbar-custom  visio-cms-px-1">
      <Accordion type="multiple" defaultValue={['theme']}>
        <AccordionItem value={'theme'}>
          <AccordionTrigger>Theme</AccordionTrigger>
          <AccordionContent>
            <Theme />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value={'scripts'}>
          <AccordionTrigger>Scripts</AccordionTrigger>
          <AccordionContent>
            {HTML_SECTIONS.map((section) => (
              <ScriptTag key={section.name} section={section} />
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
