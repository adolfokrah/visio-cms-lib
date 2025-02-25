import { usePagesState } from '@/lib/states/usePagesState';
import { v4 as uuidv4 } from 'uuid';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import lodash from 'lodash';
import AddNewPageForm from '../../add-new-page-form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTreeView } from '@/lib/states/useTreeView';
import PageTree from './page-tree';
import { generateTree, supabase } from '@/lib/utils';
import { toast } from 'sonner';
import { PageTreeItem } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { RESPONSIVE_VIEWS } from '@/lib/constants';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import useSWR from 'swr'


export default function PagesTab() {
  const { pages, setPages } = usePagesState();
  const { items, setItems } = useTreeView();
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [treeItems, setTreeItems] = useState<PageTreeItem[]>([]);
  // const [loading, setLoading] = useState(false);
  const { defaultLanguage } = useProjectConfigurationState();
  // const [error, setError] = useState<string | null>(null);

  const { data, error, isLoading: loading } = useSWR(`/api/pages`, async ()=>{
    const db = supabase();
    const { data: folders, error } = await db.from('folders').select('*');
    const { data: pagesData, error: pagesError } = await db.from('pages').select(`*, author(*)`);
    if (error || pagesError) {
      throw error || pagesError;
    }

    const data = [
      ...folders.map((folder) => ({
        ...folder,
        isExpanded: items
          .filter((item) => item.type === 'Folder')
          ?.find((itemFolder) => folder.id === itemFolder.id)?.isExpanded,
        children: [],
        type: 'Folder',
      })),
      ...pagesData.map((page) => ({ id: page.id, name: page.name, type: 'Page' })),
    ];

    return {data, pagesData}
  })

  useEffect(() => {
    if(!data) return;

    setItems(data.data as PageTreeItem[]);
    setPages(
      data.pagesData.map((page) => {
        const foundPageState = pages.find((pageState) => pageState.id == page.id);
        const blocks = page.blocks_dev;
        delete page.blocks_dev;
        return {
          ...page,
          selectedView: RESPONSIVE_VIEWS[0].view,
          activeLanguageLocale: defaultLanguage.locale,
          pinned: foundPageState?.pinned || false,
          active: foundPageState?.active || false,
          schedulePublished: page.schedule_published,
          publishDate: page.publish_date ? new Date(page.publish_date) : null,
          folderId: page.folder_id,
          blocks,
        };
      }),
    );
  }, [data]);

  useEffect(() => {
    const tree = generateTree(items, pages);
    setTreeItems(tree);
  }, [items, pages]);

  const debounceSearch = useCallback(
    lodash.debounce((value) => {
      if (value.length > 0) {
        setTreeItems(
          generateTree(
            [],
            pages.filter((page) => page.name.toLowerCase().includes(value.toLowerCase())),
          ),
        );
      } else {
        setTreeItems(generateTree(items, pages));
      }
    }, 300),
    [pages],
  );

  useEffect(() => {
    setSearch('');
  }, [pages]);

  const PageTreeComponent = useMemo(() => <PageTree items={treeItems} />, [treeItems]);

  const addNewFolder = async () => {
    const db = supabase();
    try {
      const folders = [
        {
          id: uuidv4(),
          name: `New Folder ${items.filter((item) => item.type == 'Folder').length + 1}`,
          type: 'Folder',
          children: [],
        },
        ...items,
      ];

      const { error, data } = await db
        .from('folders')
        .insert(folders.filter((folder) => folder.type === 'Folder').map((folder) => ({ name: folder.name })))
        .select();
      if (error) throw error;
      folders[0].id = data[0].id;
      setItems([...folders] as PageTreeItem[]);
    } catch (error) {
      toast.error('Failed to add new folder');
    }
  };

  if (loading)
    return (
      <div className="visio-cms-overflow-auto visio-cms-h-[calc(100vh-100px)] scrollbar-custom">
        {Array.from({ length: 20 }).map((_, i) => (
          <Skeleton
            key={`sk-${i}`}
            className="visio-cms-w-full visio-cms-mt-2 visio-cms-h-[40px] visio-cms-rounded-sm"
          />
        ))}
      </div>
    );

  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="visio-cms-overflow-auto visio-cms-h-[calc(100vh-100px)] scrollbar-custom">
        <div className="visio-cms-flex visio-cms-mb-3 visio-cms-justify-between visio-cms-items-center ">
          <p>Pages</p>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={'ghost'}>
                <PlusIcon size={15} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => {
                  setOpenModal(true);
                }}
              >
                Add a new page
              </DropdownMenuItem>
              <DropdownMenuItem onClick={addNewFolder}>Add a new folder</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Input
          placeholder="Search page"
          className="visio-cms-mb-5"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            debounceSearch(e.target.value);
          }}
        />
        <div className="visio-cms-overflow-auto visio-cms-h-[calc(100vh-200px)] visio-cms-pr-1 scrollbar-custom">
          {PageTreeComponent}
        </div>
      </div>

      <AddNewPageForm
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        folderId={''}
      />
    </>
  );
}
