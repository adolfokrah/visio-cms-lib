import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';

interface PreventNewLineOptions {
  allowNewLines?: boolean;
}
export const PreventNewLine = Extension.create<PreventNewLineOptions>({
  name: 'prevent_new_line',

  addProseMirrorPlugins() {
    const { allowNewLines = true } = this.options;
    return [
      new Plugin({
        key: new PluginKey('eventHandler'),
        props: {
          handleKeyDown: (view, event) => {
            if (allowNewLines) {
              return false;
            }
            if (event.key === 'Enter' && !event.shiftKey) {
              return true;
            }
          },
        },
      }),
    ];
  },
});
