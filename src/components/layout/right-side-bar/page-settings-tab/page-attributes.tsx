import ErrorAlert from '@/components/ui/error-alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { TagInput } from '@/components/ui/tag-input';
import usePageSettings from '@/lib/hooks/usePageSettings';

export default function PageAttributes() {
  const { handleUpdatePageName, handleUpdatePageTag, handleUpdatePageSlug, authorInitial, error, setError, page } =
    usePageSettings();

  return (
    <div key={page?.name}>
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
          onBlur={(value) => handleUpdatePageTag(value)}
          onTagRemoved={(value) => handleUpdatePageTag(value)}
        />
      </div>

      <Label className="!visio-cms-text-gray-300">Page Slug</Label>
      <Input
        className="visio-cms-my-3"
        defaultValue={page?.slug}
        onChange={() => setError('')}
        onBlur={(e) => handleUpdatePageSlug(e.target.value)}
      />
    </div>
  );
}
