import { ImageBox } from '@/components/ui/image-box';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { usePagesState } from '@/lib/states/usePagesState';
import { useMemo } from 'react';

export default function SeoMeta() {
  const { pages } = usePagesState();
  const page = useMemo(() => pages.find((page) => page.active), [pages]);
  return (
    <>
      <Label className="!visio-cms-text-gray-300">Title</Label>
      <Input className="visio-cms-my-3" defaultValue={page?.seo?.meta.title} key={page?.seo?.meta.title} />
      <Label className="!visio-cms-text-gray-300">Description</Label>
      <Textarea
        className="visio-cms-my-3"
        placeholder="Type your description here"
        defaultValue={page?.seo?.meta.description}
        key={page?.seo?.meta.description}
      />
      <Label className="!visio-cms-text-gray-300">Keywords</Label>
      <Input
        className="visio-cms-my-3"
        placeholder="eg. electronics, ai, machine learning"
        defaultValue={page?.seo?.meta.keywords}
        key={page?.seo?.meta.keywords}
      />
      <Label className="!visio-cms-text-gray-300">Featured Image</Label>
      <div className="visio-cms-my-3">
        <ImageBox imageSrc={page?.seo?.meta?.featuredImage} />
      </div>
    </>
  );
}
