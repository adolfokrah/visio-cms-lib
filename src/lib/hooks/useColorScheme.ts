import { useState } from 'react';
import { useProjectConfigurationState } from '../states/useProjectConfigState';
import { v4 as uuidv4 } from 'uuid';
import lodash from 'lodash';
import { updateOrInsertProjectConfig } from '../utils';
import { toast } from 'sonner';
export default function useColorScheme() {
  const { theme, setTheme } = useProjectConfigurationState();
  const [isEditing, setIsEditing] = useState(false);
  const { colorScheme } = theme;

  const updateColor = lodash.debounce((colorHex: string, colorName: string, index: number, id: string) => {
    updateColorAsync();
    async function updateColorAsync() {
      try {
        const newTheme = {
          ...theme,
          colorScheme: [...colorScheme.slice(0, index), { colorHex, colorName, id }, ...colorScheme.slice(index + 1)],
        };
        await updateOrInsertProjectConfig({ theme: newTheme });

        setTheme(newTheme);
      } catch (error) {
        toast.error('Failed to update color');
      }
    }
  }, 300);

  const addNewColor = async () => {
    try {
      const id = `color_${uuidv4()}__${btoa(String(colorScheme.length + 1))}`;
      const newTheme = {
        ...theme,
        colorScheme: [{ colorHex: '#ffffff', colorName: '', id }, ...colorScheme],
      };
      await updateOrInsertProjectConfig({ theme: newTheme });

      setTheme(newTheme);
    } catch (error) {
      toast.error('Failed to add new color');
    }
  };

  const deleteColor = async (index: number) => {
    try {
      const newTheme = {
        ...theme,
        colorScheme: [...colorScheme.slice(0, index), ...colorScheme.slice(index + 1)],
      };
      await updateOrInsertProjectConfig({ theme: newTheme });

      setTheme(newTheme);
    } catch (error) {
      toast.error('Failed to delete color');
    }
  };

  return { theme, isEditing, colorScheme, setIsEditing, updateColor, addNewColor, deleteColor };
}
