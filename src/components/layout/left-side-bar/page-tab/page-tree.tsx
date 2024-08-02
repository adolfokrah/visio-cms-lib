import { usePagesState } from '@/lib/states/usePagesState';
import { PageGroup } from '@/lib/types';
import { cn, hasActiveChildren } from '@/lib/utils';
import { ChevronDown, ChevronRight, FileIcon } from 'lucide-react';

export default function PageTree({ pageGroups }: { pageGroups: PageGroup[] }) {
  return (
    <div>
      {pageGroups.map((page) => {
        const { name, slug, children, id, active } = page;
        const open = hasActiveChildren(pageGroups, id);

        return (
          <div key={name} title={slug}>
            <PageItem page={page} open={open} />
            {children.length > 0 && (open || active) && (
              <div className="visio-cms-pl-2">
                <PageTree pageGroups={children} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function PageItem({ page, open }: { page: PageGroup; open?: boolean }) {
  const { name, children, active } = page;
  const { setSelectedPage, pages, setPages } = usePagesState();
  return (
    <div
      className={cn(
        'visio-cms-p-3 hover:visio-cms-bg-dark-700 visio-cms-rounded-md visio-cms-cursor-pointer visio-cms-w-full visio-cms-flex visio-cms-items-center ',
        {
          'visio-cms-bg-dark-900 visio-cms-text-primary': active,
        },
      )}
      onClick={() => {
        setSelectedPage(name);
        const newPages = pages.map((page) => ({
          ...page,
          active: page.name == name,
          pinned: page.name == name ? true : page.pinned,
        }));
        setPages(newPages);
      }}
    >
      <div className="visio-cms-flex visio-cms-gap-2">
        {children.length > 0 ? (
          <>{active || open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</>
        ) : (
          <FileIcon size={14} />
        )}
        <div className="visio-cms-truncate visio-cms-flex-nowrap visio-cms-overflow-hidden">{name}</div>
      </div>
    </div>
  );
}
