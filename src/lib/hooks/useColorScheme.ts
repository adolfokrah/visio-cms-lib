import { useState } from 'react';
import { useProjectConfigurationState } from '../states/useProjectConfigState';
import { v4 as uuidv4 } from 'uuid';
import { Color, GlobalBlock } from '../types';
import { updateColorById } from '../utils';
import { PageBlock, usePagesState } from '../states/usePagesState';
import lodash from 'lodash';
export default function useColorScheme() {
  const { theme, setTheme, globalBlocks, setGlobalBlocks } = useProjectConfigurationState();
  const { pages, setPages } = usePagesState();
  const [isEditing, setIsEditing] = useState(false);
  const { colorScheme } = theme;

  const updateColor = lodash.debounce((colorHex: string, colorName: string, index: number, id: string) => {
    setTheme({
      theme: {
        colorScheme: [...colorScheme.slice(0, index), { colorHex, colorName, id }, ...colorScheme.slice(index + 1)],
      },
    });
    updateAllInstancesOfColor({ colorHex, colorName, id });
  }, 300);

  const addNewColor = () => {
    setTheme({
      theme: {
        colorScheme: [
          { colorHex: '#ffffff', colorName: '', id: `${uuidv4()}__${btoa('visio_cms_color')}` },
          ...colorScheme,
        ],
      },
    });
  };

  const deleteColor = (index: number) => {
    setTheme({
      theme: {
        colorScheme: [...colorScheme.slice(0, index), ...colorScheme.slice(index + 1)],
      },
    });
  };

  const updateAllInstancesOfColor = (color: Color) => {
    const page = pages.find((page) => page.active);
    if (page) {
      if (page?.blocks) {
        const blocks = Object.keys(page?.blocks);
        blocks.forEach((locale) => {
          const newPageBlocks = updateColorById(
            page.blocks?.[locale] || [],
            color.id,
            color.colorHex,
            color.colorName,
          ) as PageBlock[];
          page.blocks = {
            ...page.blocks,
            [locale]: newPageBlocks,
          };
        });
      }

      const newGlobalblocks = updateColorById(globalBlocks, color.id, color.colorHex, color.colorName) as GlobalBlock[];

      setPages(pages.map((p) => (p.active ? page : p)));
      setGlobalBlocks(newGlobalblocks);
    }
  };

  return { theme, isEditing, colorScheme, setIsEditing, updateColor, addNewColor, deleteColor };
}
