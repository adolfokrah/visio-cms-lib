// src/Tiptap.tsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CustomBubbleMenu from './bubble-menu';
import Underline from '@tiptap/extension-underline';
import Blockquote from '@tiptap/extension-blockquote';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import { mergeAttributes } from '@tiptap/core';
import Link from '@tiptap/extension-link';
type Levels = 1 | 2 | 3 | 4 | 5 | 6;

const classes: Record<Levels, string> = {
  1: 'visio-cms-text-4xl',
  2: 'visio-cms-text-3xl',
  3: 'visio-cms-text-2xl',
  4: 'visio-cms-text-xl',
  5: 'visio-cms-text-lg',
  6: 'visio-cms-text-sm',
};
// define your extension array
const extensions = [
  StarterKit,
  Underline.configure(),
  Blockquote.configure({
    HTMLAttributes: {
      class: 'visio-cms-border-l visio-cms-ml-2 visio-cms-pl-4 viso-cms-text-gray-500',
    },
  }),
  BulletList.configure({
    HTMLAttributes: {
      class: 'visio-cms-list-outside visio-cms-ml-2 visio-cms-list-disc visio-cms-pl-4',
    },
  }),
  OrderedList.configure({
    HTMLAttributes: {
      class: 'visio-cms-list-outside visio-cms-ml-2 visio-cms-list-decimal visio-cms-pl-4',
    },
  }),
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }).extend({
    renderHTML({ node, HTMLAttributes }) {
      const hasLevel = this.options.levels.includes(node.attrs.level);
      const level: Levels = hasLevel ? node.attrs.level : this.options.levels[0];
      return [
        `h${level}`,
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          class: `${classes[level]}`,
        }),
        0,
      ];
    },
  }),
  Image.configure({
    inline: true,
  }),
  Link.configure({
    HTMLAttributes: {
      class: 'visio-cms-text-primary visio-cms-underline',
    },
    protocols: ['ftp', 'mailto', 'http', 'https', 'tel'],
  }),
];

const content = '<p>Hello World!</p>';

const Tiptap = () => {
  const editor = useEditor({
    extensions,
    content,
  });

  if (!editor) return null;

  return (
    <>
      <EditorContent editor={editor} />
      <CustomBubbleMenu editor={editor} />
    </>
  );
};

export default Tiptap;
