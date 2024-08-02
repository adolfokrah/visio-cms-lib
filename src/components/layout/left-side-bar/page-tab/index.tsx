import { usePagesState } from '@/lib/states/usePagesState';
import { getGroupedPages, getSearchedPages } from '@/lib/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import PageTree from './page-tree';
import { useGroupedPagesState } from '@/lib/states/useGroupedPagesState';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import lodash from 'lodash';

export default function PagesTab() {
  const { pages } = usePagesState();
  const groupedPages = useMemo(() => getGroupedPages(pages), [pages]);
  const { groupedPagesState, setGroupedPagesState } = useGroupedPagesState();
  const [search, setSearch] = useState('');
  useEffect(() => {
    setGroupedPagesState(groupedPages);
  }, [groupedPages, setGroupedPagesState]);

  const debounceSearch = useCallback(
    lodash.debounce((value) => {
      if (value.length > 0) {
        const searchedPages = getSearchedPages(groupedPages, value);
        setGroupedPagesState(searchedPages);
      } else {
        setGroupedPagesState(groupedPages);
      }
    }, 300),
    [pages],
  );

  useEffect(() => {
    setSearch('');
  }, [pages]);

  return (
    <div>
      <div className="visio-cms-flex visio-cms-mb-3 visio-cms-justify-between visio-cms-items-center ">
        <p>Pages</p>
        <Button variant={'ghost'}>
          <PlusIcon size={15} />
        </Button>
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
        <PageTree pageGroups={groupedPagesState} />
      </div>
    </div>
  );
}
