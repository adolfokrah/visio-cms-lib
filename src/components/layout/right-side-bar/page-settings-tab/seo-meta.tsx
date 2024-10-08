import { ImageBox } from '@/components/ui/image-box';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import usePageSettings from '@/lib/hooks/usePageSettings';

export default function SeoMeta() {
  const { page, updatePageMeta, updatePageFeaturedImage } = usePageSettings();
  const pageMeta = page?.seo?.[page.activeLanguageLocale]?.meta;
  return (
    <div key={`${page?.id}-${page?.activeLanguageLocale}`}>
      <Label className="!visio-cms-text-gray-300">Title</Label>
      <Input
        className="visio-cms-my-3"
        placeholder="Type your title here"
        defaultValue={pageMeta?.title}
        onBlur={(e) => updatePageMeta({ title: e.target.value })}
      />
      <Label className="!visio-cms-text-gray-300">Description</Label>
      <Textarea
        className="visio-cms-my-3"
        placeholder="Type your description here"
        defaultValue={pageMeta?.description}
        onBlur={(e) => updatePageMeta({ description: e.target.value })}
      ></Textarea>
      <Label className="!visio-cms-text-gray-300">Keywords</Label>
      <Input
        className="visio-cms-my-3"
        placeholder="eg. electronics, ai, machine learning"
        defaultValue={pageMeta?.keywords}
        onBlur={(e) => updatePageMeta({ keywords: e.target.value })}
      />
      <Label className="!visio-cms-text-gray-300">Featured Image</Label>
      <div className="visio-cms-my-3">
        <ImageBox
          image={{
            mediaHash: pageMeta?.featuredImage,
            altText: '',
            width: 0,
            height: 0,
          }}
          onImageChosen={(image) => {
            updatePageFeaturedImage(image?.mediaHash);
          }}
        />
      </div>
    </div>
  );
}
