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
  const { supportedLanguages, defaultLanguage } = useProjectConfigurationState();
  const activePage = pages.find((page) => page.active);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="!visio-cms-bg-transparent hover:!visio-cms-bg-dark-700 visio-cms-w-[60px] visio-cms-shadow-none">
          {activePage?.activeLanguageLocale.toLocaleUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="visio-cms-w-[160px]">
        {supportedLanguages.map(({ language, locale }) => (
          <DropdownMenuItem
            key={language}
            onClick={() => {
              const newPages = pages.map((page) => {
                const data = {
                  ...page,
                  activeLanguageLocale: activePage?.name === page.name ? locale : page.activeLanguageLocale,
                  blocks: {
                    ...page.blocks,
                    [locale]:
                      (page.blocks?.[locale]?.length ?? 0) < 1
                        ? page.blocks?.[defaultLanguage?.locale || ''] || []
                        : page.blocks?.[locale] || [],
                  },
                };
                if (!page?.seo?.[locale]) {
                  data.seo = {
                    ...page.seo,
                    [locale]: {
                      meta: {
                        title: page.seo?.[defaultLanguage?.locale || '']?.meta?.title || '',
                        description: page.seo?.[defaultLanguage?.locale || '']?.meta?.description || '',
                        keywords: page.seo?.[defaultLanguage?.locale || '']?.meta?.keywords || '',
                        featuredImage: page.seo?.[defaultLanguage?.locale || '']?.meta?.featuredImage || '',
                      },
                    },
                  };
                }
                return data;
              });

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
