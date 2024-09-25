import { Block, PageBlock } from '@/lib/exposed-types';
import Slot from '../exposed-components/slot';

interface BlogContentProps {
  content: PageBlock[];
  pageBlockId?: string;
  buttons: PageBlock[];
}

const BlogContent: Block<BlogContentProps> = ({ content, pageBlockId = '', buttons }) => {
  return (
    <div className="visio-cms-py-2">
      <div className="visio-cms-mx-auto visio-cms-w-[80%]">
        <h1>Blog content here</h1>
        <Slot propName="content" pageBlocks={content} pageBlockId={pageBlockId} />
        <div className="visio-cms-h-[100px] visio-cms-w-full visio-cms-mt-6">
          <Slot propName="buttons" direction="horizontal" pageBlocks={buttons} pageBlockId={pageBlockId} />
        </div>
      </div>
    </div>
  );
};

BlogContent.Schema = {
  name: 'Blog content',
  id: 'blog-content',
  sideEditingProps: [],
  defaultPropValues: {
    content: [],
    buttons: [],
  },
  group: 'Content',
};

export default BlogContent;
