import { Block, PageBlock } from '@/lib/exposed-types';
import Slot from '../exposed-components/slot';

interface BlogContentProps {
  content: PageBlock[];
  pageBlockId?: string;
}

const BlogContent: Block<BlogContentProps> = ({ content, pageBlockId = '' }) => {
  return (
    <div className="visio-cms-py-2">
      <div className="visio-cms-mx-auto visio-cms-w-[80%]">
        <h1>Blog content here</h1>
        <Slot propName='content' pageBlocks={content} pageBlockId={pageBlockId}/>
      </div>
    </div>
  );
};

BlogContent.Schema = {
  name: 'Blog content',
  id: 'blog-content',
  sideEditingProps: [],
  defaultPropValues: {
    content: []
  },
  group: 'Content',
};

export default BlogContent;
