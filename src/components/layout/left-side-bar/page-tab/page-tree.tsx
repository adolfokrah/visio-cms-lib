import { usePagesState } from '@/lib/states/usePagesState';
import { PageGroup } from '@/lib/types';
import { cn, getAllSlugs } from '@/lib/utils';
import { FolderOpen, Folder, MoreVerticalIcon, Circle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSubContent,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import AddNewPageForm from '../../add-new-page-form';
import { useCallback, useState } from 'react';
import { useGroupedPagesState } from '@/lib/states/useGroupedPagesState';
import DeletePageAction from './delete-page-action';
import usePage from '@/lib/hooks/usePage';

export default function PageTree({ pageGroups }: { pageGroups: PageGroup[] }) {
  return (
    <div>
      {pageGroups.map((page) => {
        const { name, slug, children, isExpanded } = page;

        return (
          <div key={name} title={slug}>
            <PageItem page={page} open={isExpanded} />
            {children.length > 0 && isExpanded && (
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
  const [openModal, setOpenModal] = useState(false);
  const { groupedPagesState } = useGroupedPagesState();
  const [parentSlug, setParentSlug] = useState('/');
  const [parentPage, setParentPage] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const { duplicatePage } = usePage({});

  const updateSelectedPage = useCallback(() => {
    setSelectedPage(name);
    const newPages = pages.map((page) => ({
      ...page,
      active: page.name == name,
      pinned: page.name == name ? true : page.pinned,
      isExpanded: page.name == name ? (page?.isExpanded ? false : true) : page.isExpanded,
    }));
    setPages(newPages);
  }, [pages, setPages, setSelectedPage, name]);

  return (
    <>
      <div
        className={cn(
          'visio-cms-p-3 visio-cms-group  visio-cms-justify-between hover:visio-cms-bg-dark-700 visio-cms-rounded-md visio-cms-cursor-pointer visio-cms-w-full visio-cms-flex visio-cms-items-center ',
          {
            'visio-cms-bg-dark-900 visio-cms-text-primary': active,
          },
        )}
        onClick={updateSelectedPage}
      >
        <div className="visio-cms-flex visio-cms-gap-2  visio-cms-items-center">
          {children.length > 0 ? (
            <>
              {open ? (
                <FolderOpen size={14} className="visio-cms-flex-shrink-0" />
              ) : (
                <Folder
                  size={14}
                  className={cn('visio-cms-flex-shrink-0 visio-cms-fill-white', {
                    '!visio-cms-fill-primary !visio-cms-text-primary': active,
                  })}
                />
              )}
            </>
          ) : (
            <Circle
              size={10}
              className={cn('visio-cms-flex-shrink-0 visio-cms-text-slate-500 visio-cms-fill-slate-500', {
                '!visio-cms-fill-primary !visio-cms-text-primary': active,
              })}
            />
          )}
          <div className="visio-cms-truncate visio-cms-w-[calc(100%-10px)] visio-cms-flex-nowrap visio-cms-overflow-hidden">
            {name}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <MoreVerticalIcon
              size={14}
              className="visio-cms-invisible group-hover:visio-cms-visible visio-cms-flex-shrink-0"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setOpenModal(true);
                setParentSlug(`${getAllSlugs(groupedPagesState, page.id)[0]}/`);
                setParentPage(page.id);
              }}
            >
              Add sub page
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setOpenAlert(true);
              }}
            >
              Delete page
            </DropdownMenuItem>

            {page.parentPage && page.parentPage != '' ? (
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Duplicate page</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicatePage({ page });
                        }}
                      >
                        Under parent
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicatePage({ page, isolate: true });
                        }}
                      >
                        Isolate
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            ) : (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  duplicatePage({ page, isolate: true });
                }}
              >
                Duplicate page
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <AddNewPageForm
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        parentSlug={parentSlug}
        parentPage={parentPage}
      />
      <DeletePageAction
        page={page}
        open={openAlert}
        onClose={() => {
          setOpenAlert(false);
        }}
      />
    </>
  );
}
