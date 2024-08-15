// src/Tiptap.tsx
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
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
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import { EDITOR_MENU_CONTROLS } from '@/lib/constants';

type Levels = 1 | 2 | 3 | 4 | 5 | 6;

const classes: Record<Levels, string> = {
  1: 'visio-cms-text-4xl visio-cms-editor-h1',
  2: 'visio-cms-text-3xl visio-cms-editor-h2',
  3: 'visio-cms-text-2xl visio-cms-editor-h3',
  4: 'visio-cms-text-xl visio-cms-editor-h4',
  5: 'visio-cms-text-lg visio-cms-editor-h5',
  6: 'visio-cms-text-sm visio-cms-editor-h6',
};
// define your extension array
const extensions = [
  StarterKit,
  Underline.configure(),
  Blockquote.configure({
    HTMLAttributes: {
      class: 'visio-cms-border-l visio-cms-ml-2 visio-cms-pl-4 viso-cms-text-gray-500 visio-cms-editor-blockquote',
    },
  }),
  BulletList.configure({
    HTMLAttributes: {
      class: 'visio-cms-list-outside visio-cms-ml-2 visio-cms-list-disc visio-cms-pl-4 visio-cms-editor-bullet-list',
    },
  }),
  OrderedList.configure({
    HTMLAttributes: {
      class:
        'visio-cms-list-outside visio-cms-ml-2 visio-cms-list-decimal visio-cms-pl-4 visio-cms-editor-ordered-list',
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
    HTMLAttributes: {
      class: 'visio-cms-editor-image',
    },
  }),
  Link.configure({
    HTMLAttributes: {
      class: 'visio-cms-text-primary visio-cms-underline visio-cms-editor-link',
    },
    protocols: ['ftp', 'mailto', 'http', 'https', 'tel'],
  }),
  Color.configure({
    types: ['textStyle'],
  }),
  Highlight.configure({
    multicolor: true,
    HTMLAttributes: {
      class: 'visio-cms-editor-highlight',
    },
  }),
  TextStyle,
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
      <BubbleMenu editor={editor}>
        <CustomBubbleMenu
          editor={editor}
          allowedControls={[
            ...EDITOR_MENU_CONTROLS.map((control) => control.name).filter((control) => control != 'image'),
          ]}
        />
      </BubbleMenu>
      <FloatingMenu editor={editor}>
        <CustomBubbleMenu
          editor={editor}
          allowedControls={[
            ...EDITOR_MENU_CONTROLS.map((control) => control.name).filter((control) => control === 'image'),
          ]}
        />
      </FloatingMenu>
    </>
  );
};

export default Tiptap;
