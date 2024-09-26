import { Block } from '@/lib/types';
import RichTextEditor from '../exposed-components/rich-text-editor';

const TextBlock: Block<{ content: string; pageBlockId?: string }> = ({ content, pageBlockId = '' }) => {
  return <RichTextEditor propName="content" pageBlockId={pageBlockId} defaultValue={content} />;
};

TextBlock.Schema = {
  name: 'Text block',
  id: 'text-block',
  sideEditingProps: [],
  defaultPropValues: {
    content: 'content goes here',
  },
};

export default TextBlock;
