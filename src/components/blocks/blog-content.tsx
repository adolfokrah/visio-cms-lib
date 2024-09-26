import { Block, MediaFile, PageBlock } from '@/lib/exposed-types';
import Slot from '../exposed-components/slot';
import Text from '../exposed-components/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from '../exposed-components/image';
import { Dot } from 'lucide-react';
interface BlogContentProps {
  content: PageBlock[];
  pageBlockId?: string;
  title: string;
  image: MediaFile;
}

const pageData = {
  date: '23 Sep 2024',
  minRead: '2 minutes',
  author: {
    image: 'https://supabase.com/_next/image?url=https%3A%2F%2Fgithub.com%2Fjmeistrich.png&w=48&q=75',
    name: 'John Doe',
  },
};
const BlogContent: Block<BlogContentProps> = ({ content, pageBlockId = '', image, title }) => {
  return (
    <div className="visio-cms-py-2">
      <div className="visio-cms-mx-auto visio-cms-max-w-2xl">
        <h3 className="visio-cms-text-primary">Blog</h3>
        <h1 className="visio-cms-text-3xl visio-cms-font-bold visio-cms-my-2">
          <Text propName="title" pageBlockId={pageBlockId} defaultValue={title} />
        </h1>
        <div className="visio-cms-flex visio-cms-items-center ">
          {pageData?.date}
          <Dot size={30} />
          {pageData?.minRead} read
        </div>
        <div className="visio-cms-mt-2 visio-cms-flex visio-cms-items-center visio-cms-gap-2">
          <Avatar>
            <AvatarImage src={pageData.author.image} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <p className="visio-cms-font-bold">{pageData.author.name}</p>
            <small className="visio-cms-text-gray-800">Guest Author</small>
          </div>
        </div>
        <Image
          pageBlockId={pageBlockId}
          propName="image"
          defaultValue={image}
          wrapperClassName="visio-cms-w-full visio-cms-my-4 relative visio-cms-rounded-lg visio-cms-overflow-hidden"
          renderImage={(image) => (
            <img
              src={image.imagePublicUrl}
              alt={image.altText}
              className="visio-cms-w-full visio-cms-h-full visio-cms-object-cover"
            />
          )}
        />
        <Slot pageBlocks={content} propName="content" pageBlockId={pageBlockId} />
      </div>
    </div>
  );
};

BlogContent.Schema = {
  name: 'Blog content',
  id: 'blog-content',
  sideEditingProps: [],
  defaultPropValues: {
    image: {
      mediaHash: undefined,
      width: 0,
      height: 0,
      altText: 'nothing',
    },
    content: [],
    title: 'Blog title',
  },
  group: 'Content',
};

export default BlogContent;
