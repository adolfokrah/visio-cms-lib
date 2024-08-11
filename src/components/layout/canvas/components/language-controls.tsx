import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { usePagesState } from '@/lib/states/usePagesState';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
export default function LanguageControls() {
  const { pages, setPages } = usePagesState();
  const { supportedLanguages } = useProjectConfigurationState();
  const activePage = pages.find((page) => page.active);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="!visio-cms-bg-transparent hover:!visio-cms-bg-dark-700 visio-cms-w-[60px]">
          {activePage?.activeLanguageLocale.toLocaleUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="visio-cms-w-[160px]">
        {supportedLanguages.map(({ language, locale }) => (
          <DropdownMenuItem
            key={language}
            onClick={() => {
              const newPages = pages.map((page) => ({
                ...page,
                activeLanguageLocale: activePage?.name === page.name ? locale : page.activeLanguageLocale,
              }));
              setPages(newPages);
            }}
          >
            {language}
            <DropdownMenuShortcut>{locale}</DropdownMenuShortcut>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
