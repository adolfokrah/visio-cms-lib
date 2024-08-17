import { Block } from '@/lib/exposed-types';
import RichTextEditor from '../exposed-components/rich-text-editor';

interface BlogContentProps {
  content: string;
  pageBlockId?: string;
}

const BlogContent: Block<BlogContentProps> = ({ content, pageBlockId = '' }) => {
  return (
    <div className="visio-cms-py-2">
      <div className="visio-cms-mx-auto visio-cms-w-[80%]">
        <RichTextEditor propName="content" defaultValue={content} pageBlockId={pageBlockId} />
      </div>
    </div>
  );
};

BlogContent.Schema = {
  name: 'Blog content',
  id: 'blog-content',
  sideEditingProps: [],
  defaultPropValues: {
    content: 'This is a blog content',
  },
  group: 'Content',
};

export default BlogContent;
