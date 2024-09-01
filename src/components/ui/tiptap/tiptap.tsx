// src/Tiptap.tsx
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CustomBubbleMenu from './bubble-menu';
import Underline from '@tiptap/extension-underline';
import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import { mergeAttributes } from '@tiptap/core';
import Link from '@tiptap/extension-link';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import { PreventNewLine } from './custom-extensions/prevent-new-line';
import { EditorControlTypes } from '@/lib/types';
import { useEffect, useState } from 'react';
import TextAlign from '@tiptap/extension-text-align';
import { usePageContentState } from '@/lib/states/usePageContentState';

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
  Underline.configure(),
  StarterKit.configure({
    blockquote: {
      HTMLAttributes: {
        class: 'visio-cms-border-l visio-cms-ml-2 visio-cms-pl-4 viso-cms-text-gray-500 visio-cms-editor-blockquote',
      },
    },
    bulletList: {
      HTMLAttributes: {
        class: 'visio-cms-list-outside visio-cms-ml-2 visio-cms-list-disc visio-cms-pl-4 visio-cms-editor-bullet-list',
      },
    },
    orderedList: {
      HTMLAttributes: {
        class:
          'visio-cms-list-outside visio-cms-ml-2 visio-cms-list-decimal visio-cms-pl-4 visio-cms-editor-ordered-list',
      },
    },
    heading: false,
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
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  TextStyle,
];

const Tiptap = ({
  allowNewLines = true,
  allowedControls,
  defaultValue,
  onChange,
  isEditable,
}: {
  allowNewLines?: boolean;
  allowedControls?: EditorControlTypes[];
  defaultValue?: string;
  isEditable: boolean;
  onChange: (value: string) => void;
}) => {
  const { tabs } = usePageContentState();
  const activeTab = tabs.find((tab) => tab.active)?.id;
  const [isFocused, setIsFocused] = useState(false);
  const value =
    typeof defaultValue == 'string' ? (defaultValue?.includes('<p>') ? defaultValue : `<p>${defaultValue}</p>`) : '';

  const editor = useEditor({
    extensions: [...extensions, PreventNewLine.configure({ allowNewLines })],
    editable: isEditable,
    content: value,
    immediatelyRender: true,
    onFocus: () => setIsFocused(true),
    onBlur: ({ editor }) => {
      const { view } = editor;
      const { selection } = view.state;
      if (selection.empty) {
        setIsFocused(false);
      }
    },
    onUpdate: ({ editor }) => {
      if (editor.getHTML() == value) {
        return;
      }
      onChange(editor?.getHTML());
    },
  });

  useEffect(() => {
    if (activeTab && editor && value && !isFocused) {
      editor.commands.setContent(value || '');
    }
  }, [activeTab, editor, value, isFocused]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditable);
    }
  }, [isEditable, editor]);

  if (!editor) return null;

  return (
    <>
      <EditorContent editor={editor} />
      {allowedControls && allowedControls.length > 0 && (
        <BubbleMenu
          editor={editor}
          className="visio-cms-max-w-[330px]  !visio-cms-text-xs visio-cms-w-max visio-cms-flex visio-cms-gap-1 visio-cms-flex-wrap visio-cms-bg-dark-900 visio-cms-rounded-md visio-cms-border visio-cms-border-dark-800 visio-cms-text-white visio-cms-p-1"
        >
          <CustomBubbleMenu
            editor={editor}
            allowedControls={[...allowedControls.filter((control) => control != 'image')]}
          />
        </BubbleMenu>
      )}
      {allowedControls && allowedControls.includes('image') && (
        <FloatingMenu editor={editor}>
          <CustomBubbleMenu editor={editor} allowedControls={['image']} />
        </FloatingMenu>
      )}
    </>
  );
};

export default Tiptap;
