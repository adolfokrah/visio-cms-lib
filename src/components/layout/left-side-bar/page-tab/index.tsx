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
import { generateTree } from '@/lib/utils';

export default function PagesTab() {
  const { pages } = usePagesState();
  const { items, setItems } = useTreeView();
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const pageItems = useMemo(() => generateTree(items, pages), [pages]);
  const [treeItems, setTreeItems] = useState(pageItems);

  useEffect(() => {
    setItems(pageItems);
  }, [pageItems, setItems]);

  useEffect(() => {
    setTreeItems(items);
  }, [items]);

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

  return (
    <>
      <div>
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
              <DropdownMenuItem
                onClick={() => {
                  setItems([
                    {
                      id: uuidv4(),
                      name: `New Folder ${items.filter((item) => item.type == 'Folder').length + 1}`,
                      type: 'Folder',
                      children: [],
                    },
                    ...items,
                  ]);
                }}
              >
                Add a new folder
              </DropdownMenuItem>
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
