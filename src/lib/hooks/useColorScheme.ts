import { useState } from 'react';
import { useProjectConfigurationState } from '../states/useProjectConfigState';
import { v4 as uuidv4 } from 'uuid';
import lodash from 'lodash';
export default function useColorScheme() {
  const { theme, setTheme } = useProjectConfigurationState();
  const [isEditing, setIsEditing] = useState(false);
  const { colorScheme } = theme;

  const updateColor = lodash.debounce((colorHex: string, colorName: string, index: number, id: string) => {
    setTheme({
      theme: {
        colorScheme: [...colorScheme.slice(0, index), { colorHex, colorName, id }, ...colorScheme.slice(index + 1)],
      },
    });
  }, 300);

  const addNewColor = () => {
    const id = `color_${uuidv4()}__${btoa(String(colorScheme.length + 1))}`;
    setTheme({
      theme: {
        colorScheme: [{ colorHex: '#ffffff', colorName: '', id }, ...colorScheme],
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

  return { theme, isEditing, colorScheme, setIsEditing, updateColor, addNewColor, deleteColor };
}
