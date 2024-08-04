import ErrorAlert from '@/components/ui/error-alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePagesState } from '@/lib/states/usePagesState';
import { useCallback, useMemo, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { TagInput } from '@/components/ui/tag-input';
import { formatStringToSlug } from '@/lib/utils';

export default function PageAttributes() {
  const { pages, setPages } = usePagesState();
  const page = useMemo(() => pages.find((page) => page.active), [pages]);
  const [error, setError] = useState<string>('');

  const handleUpdatePageName = useCallback(
    (value: string) => {
      if (!value) {
        setError('Page name can not be empty');
        return;
      }
      const isPageNameExists = pages.find((page) => page.name.toLowerCase() === value.toLowerCase() && !page.active);

      if (isPageNameExists) {
        setError(`Page name ${value} already exists`);
        return;
      }
      setPages(pages.map((page) => ({ ...page, name: page.active ? value : page.name })));
      setError('');
    },
    [pages, setPages],
  );

  const handleUpdatePageTag = useCallback(
    (value: string) => {
      setPages(pages.map((page) => ({ ...page, tags: page.active ? value : page.tags })));
    },
    [pages, setPages],
  );

  const handleUpdatePageSlug = useCallback(
    (value: string) => {
      const slug = `/${formatStringToSlug(value)}`;
      if (!value) {
        setError('Page slug can not be empty');
        return;
      }
      const isPageNameExists = pages.find((page) => page.slug.toLowerCase() === slug.toLowerCase() && !page.active);

      if (isPageNameExists) {
        setError(`Page slug already exists`);
        return;
      }
      setPages(pages.map((page) => ({ ...page, slug: page.active ? slug : page.slug })));
    },
    [pages, setPages],
  );

  const authorInitial = useMemo(() => {
    const author = page?.author;
    if (author) {
      const firstName = author.first_name || '';
      const lastName = author.last_name || '';
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return '';
  }, [page?.author]);

  return (
    <div>
      <ErrorAlert
        className="visio-cms-bg-dark-900 visio-cms-my-2"
        errorMessage={error}
        onClearError={() => {
          setError('');
        }}
      />
      <Label className="!visio-cms-text-gray-300">Page name</Label>
      <Input
        className="visio-cms-my-3"
        defaultValue={page?.name}
        key={page?.name}
        onBlur={(e) => handleUpdatePageName(e.target.value)}
        onChange={() => setError('')}
      />

      <Label className="!visio-cms-text-gray-300">Author</Label>
      <div className="visio-cms-my-3">
        <Button className="visio-cms-w-full visio-cms-h-9 !visio-cms-bg-dark-900 !visio-cms-justify-start">
          <Avatar className="visio-cms-w-[30px] visio-cms-h-[30px]  visio-cms-text-xs  visio-cms-my-1">
            <AvatarImage src={page?.author?.photo} />
            <AvatarFallback>{authorInitial}</AvatarFallback>
          </Avatar>
          <div className="visio-cms-ml-2 !visio-cms-text-white">
            {page?.author?.first_name} {page?.author?.last_name}
          </div>
        </Button>
      </div>
      <Label className="!visio-cms-text-gray-300">Tags</Label>
      <div className="visio-cms-my-3">
        <TagInput
          defaultValue={page?.tags}
          key={page?.tags}
          onBlur={(value) => handleUpdatePageTag(value)}
          onTagRemoved={(value) => handleUpdatePageTag(value)}
        />
      </div>

      <Label className="!visio-cms-text-gray-300">Page Slug</Label>
      <Input
        className="visio-cms-my-3"
        defaultValue={page?.slug}
        key={page?.slug}
        onChange={() => setError('')}
        onBlur={(e) => handleUpdatePageSlug(e.target.value)}
      />
    </div>
  );
}
