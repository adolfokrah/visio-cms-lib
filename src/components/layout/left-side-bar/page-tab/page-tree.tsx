import { Input } from '@/components/ui/input';
import { Page, usePagesState } from '@/lib/states/usePagesState';
import { useTreeView } from '@/lib/states/useTreeView';
import { PageTreeItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Circle, Folder, FolderOpen, MoreVerticalIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
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
import usePage from '@/lib/hooks/usePage';
import DeletePageAction from './delete-page-action';
import AddNewPageForm from '../../add-new-page-form';

export default function PageTree({ items }: { items: PageTreeItem[] }) {
  return (
    <>
      {items.map((treeItem) => {
        if (treeItem.type === 'Folder') {
          return (
            <div key={treeItem.name} title={treeItem.name}>
              <FolderItem item={treeItem} />
              {treeItem.isExpanded && (
                <div className="visio-cms-pl-4">
                  <PageTree items={treeItem.children} />
                </div>
              )}
            </div>
          );
        }
        return (
          <div key={treeItem.name} title={treeItem.slug}>
            <PageItem item={treeItem} />
          </div>
        );
      })}
    </>
  );
}

function FolderItem({ item }: { item: PageTreeItem }) {
  const { items, setItems } = useTreeView();
  const [editing, setEditing] = useState(false);
  const { pages, setPages } = usePagesState();
  const [isDragging, setIsDragging] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openAlert, setOpenAlert] = useState<{ withPages: boolean } | null>(null);

  const toggleExpand = useCallback(() => {
    const newItems = items.map((i) => {
      if (i.id === item.id) {
        i.isExpanded = !i.isExpanded;
      }
      return i;
    });
    setItems(newItems);
  }, [items, setItems, item]);

  const updateFolderName = useCallback(
    (name: string) => {
      const newItems = items.map((i) => {
        if (i.id === item.id) {
          i.name = name;
        }
        return i;
      });
      setItems(newItems);
    },
    [items, setItems, item],
  );

  const addFileToChildren = useCallback(
    (pageId: string) => {
      const foundPage = pages.find((page) => page.id == pageId);
      if (foundPage) {
        const newItems = items.map((i) => {
          if (i.id === item.id && i.type == 'Folder') {
            i.children.push({
              ...foundPage,
              type: 'Page',
            });
          }
          return i;
        });
        setItems(newItems);
        setPages(pages.map((page) => ({ ...page, folderId: page.id === foundPage.id ? item.id : page.folderId })));
      }
    },
    [items, item, setItems, pages, setPages],
  );

  return (
    <div
      className={cn(
        'visio-cms-p-3 visio-cms-group  visio-cms-justify-between hover:visio-cms-bg-dark-700 visio-cms-rounded-md visio-cms-cursor-pointer visio-cms-w-full visio-cms-flex visio-cms-items-center ',
        { 'visio-cms-bg-dark-900': isDragging },
      )}
      onClick={() => {
        toggleExpand();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
      onDragOver={(e) => {
        setIsDragging(true);
        e.preventDefault();
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('text/plain');
        const droppedItem = data;
        setIsDragging(false);
        addFileToChildren(droppedItem);
        // Handle the dropped item here
      }}
    >
      <div className="visio-cms-w-[calc(100%-20px)]">
        <div className="visio-cms-flex visio-cms-gap-2   visio-cms-items-center">
          <>
            {item.isExpanded ? (
              <FolderOpen size={14} className="visio-cms-flex-shrink-0" />
            ) : (
              <Folder size={14} className={cn('visio-cms-flex-shrink-0 visio-cms-fill-white')} />
            )}
          </>
          <div className="visio-cms-truncate visio-cms-w-[calc(100%-10px)] visio-cms-flex-nowrap visio-cms-overflow-hidden">
            {!editing ? (
              item.name
            ) : (
              <Input
                autoFocus
                type="text"
                onFocus={(e) => e.stopPropagation()}
                defaultValue={item.name}
                key={item.name}
                onBlur={(e) => {
                  setEditing(false);
                  updateFolderName(e.currentTarget.value);
                }}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    updateFolderName(e.currentTarget.value);
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div className=" visio-cms-flex-shrink-0 visio-cms-w-[10px] ">
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <MoreVerticalIcon size={14} className="visio-cms-invisible group-hover:visio-cms-visible" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setOpenModal(true);
              }}
            >
              Add page to folder
            </DropdownMenuItem>

            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Delete</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenAlert({ withPages: false });
                      }}
                    >
                      Folder & Isolate pages
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenAlert({ withPages: true });
                      }}
                    >
                      Folder & All pages
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AddNewPageForm
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        folderId={item.id}
      />

      <DeletePageAction
        page={item}
        open={openAlert}
        onClose={() => {
          setOpenAlert(null);
        }}
      />
    </div>
  );
}

function PageItem({ item }: { item: PageTreeItem }) {
  const { pages, setPages } = usePagesState();
  const { duplicatePage } = usePage({});
  const [openAlert, setOpenAlert] = useState<{ withPages: boolean } | null>(null);
  const updateSelectedPage = useCallback(() => {
    const newPages = pages.map((page) => ({
      ...page,
      active: page.id == item.id,
      pinned: page.id == item.id ? true : page.pinned,
    }));
    setPages(newPages);
  }, [pages, setPages, item]);

  if (item.type == 'Folder') return null;

  return (
    <div
      className={cn(
        'visio-cms-p-3 visio-cms-group  visio-cms-justify-between hover:visio-cms-bg-dark-700 visio-cms-rounded-md visio-cms-cursor-pointer visio-cms-w-full visio-cms-flex visio-cms-items-center ',
        {
          '!visio-cms-bg-dark-900 !visio-cms-text-primary': item.active,
        },
      )}
      onClick={() => {
        updateSelectedPage();
      }}
      draggable={true} // Add draggable attribute
      onDragStart={(e) => {
        e.stopPropagation();
        e.dataTransfer.setData('text/plain', item.id); // Set the data to be transferred during drag
      }}
    >
      <div className="visio-cms-flex visio-cms-gap-2 visio-cms-w-full visio-cms-justify-between  visio-cms-items-center">
        <div className="visio-cms-w-[calc(100%-20px)]">
          <div className="visio-cms-flex visio-cms-items-center visio-cms-w-full visio-cms-gap-2  ">
            <Circle
              size={10}
              className={cn('visio-cms-flex-shrink-0 visio-cms-text-slate-500 visio-cms-fill-slate-500', {
                '!visio-cms-fill-primary !visio-cms-text-primary': item.status == 'Publish',
              })}
            />
            <div className="visio-cms-truncate visio-cms-flex-nowrap visio-cms-overflow-hidden">{item.name}</div>
          </div>
        </div>

        <div className=" visio-cms-flex-shrink-0 visio-cms-w-[10px] ">
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <MoreVerticalIcon size={14} className="visio-cms-invisible group-hover:visio-cms-visible" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenAlert({ withPages: false });
                }}
              >
                Delete page
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  duplicatePage({ page: item as Page });
                }}
              >
                Duplicate page
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DeletePageAction
        page={item}
        open={openAlert}
        onClose={() => {
          setOpenAlert(null);
        }}
      />
    </div>
  );
}
