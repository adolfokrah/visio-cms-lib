import { Block } from '@/lib/types';
import RichTextEditor from '../exposed-components/rich-text-editor';

type TextBlockProps = {
  content: string;
  pageBlockId?: string;
}

const TextBlock: React.FC<TextBlockProps> = ({ content, pageBlockId = '' }) => {
  return <RichTextEditor propName="content" pageBlockId={pageBlockId} defaultValue={content} />;
};

const TextBlockSchema:Block<TextBlockProps> = {
  component: TextBlock,
  name: 'Text block',
  id: 'text-block',
  sideEditingProps: [],
  defaultPropValues: {
    content: 'content goes here',
  },
};

export default TextBlockSchema;
