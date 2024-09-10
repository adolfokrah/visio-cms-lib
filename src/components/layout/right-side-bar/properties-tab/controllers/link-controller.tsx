import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { usePagesState } from '@/lib/states/usePagesState';
import { cn, isValidURL } from '@/lib/utils';
import { LinkIcon, Trash } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function LinkController({
  defaultValue,
  onChange,
}: {
  defaultValue: string;
  onChange: (value: string) => void;
}) {
  const { pages } = usePagesState();
  const [search, setSearch] = useState('');
  const searchedPages = useMemo(
    () => pages.filter((page) => page.name.toLowerCase().includes(search.toLowerCase())),
    [search, pages],
  );
  const [open, setOpen] = useState(false);
  const selectedPage = useMemo(
    () => pages.find((page) => page.id === defaultValue)?.name || defaultValue,
    [defaultValue, pages],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        onClick={(e) => {
          setOpen(true);
          e.stopPropagation();
        }}
      >
        <div
          className={cn(
            'visio-cms-flex visio-cms-group visio-cms-bg-dark-900 visio-cms-pl-2 visio-cms-rounded-md visio-cms-mb-3 visio-cms-items-center visio-cms-justify-between hover:visio-cms-bg-dark-700 visio-cms-cursor-pointer',
            {
              'visio-cms-p-[10px] ': defaultValue?.length < 1 || !defaultValue,
              'visio-cms-p-1 ': defaultValue?.length > 0,
            },
          )}
        >
          <div className="visio-cms-flex visio-cms-gap-2 visio-cms-items-center visio-cms-w-[calc(100%-60px)]">
            <LinkIcon size={16} className="visio-cms-flex-shrink-0" />

            <div className="visio-cms-w-[calc(100%-10px)]">
              <p className="visio-cms-ml-2 visio-cms-truncate visio-cms-whitespace-nowrap">{selectedPage}</p>
            </div>
          </div>
          {defaultValue && (
            <Button
              variant={'ghost'}
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
            >
              <Trash size={14} />
            </Button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className=" visio-cms-p-0 visio-cms-gap-2 visio-cms-h-[300px] visio-cms-flex visio-cms-flex-col visio-cms-max-w-[300px]"
        side="left"
        align="start"
        sideOffset={20}
      >
        <Input placeholder="Search or enter a url" value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="visio-cms-flex-1 visio-cms-overflow-auto scrollbar-custom">
          {searchedPages.map((page) => (
            <div
              key={page.id}
              className="visio-cms-hover-bg-dark-700 visio-cms-cursor-pointer visio-cms-py-2 hover:visio-cms-bg-dark-700 visio-cms-rounded-md visio-cms-px-2"
              onClick={() => {
                setOpen(false);
                onChange(page.id);
                setSearch('');
              }}
            >
              {page.name}
            </div>
          ))}

          {searchedPages.length === 0 && (
            <div className="visio-cms-text-center visio-cms-pt-16  visio-cms-text-gray-300 visio-cms-mt-4">
              <p>No pages found</p>

              {isValidURL(search) || search.startsWith('/') ? (
                <Button
                  variant={'outline'}
                  className="visio-cms-mt-2"
                  onClick={() => {
                    setOpen(false);
                    onChange(search);
                    setSearch('');
                  }}
                >
                  Add {search.startsWith('/') && 'absolute'} url as a link
                </Button>
              ) : (
                <p className="visio-cms-mt-2 visio-cms-font-light">Type a valid url to add as a link</p>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
