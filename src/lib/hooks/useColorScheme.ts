import { useState } from 'react';
import { useProjectConfigurationState } from '../states/useProjectConfigState';

export default function useColorScheme() {
  const { theme, setTheme } = useProjectConfigurationState();
  const [isEditing, setIsEditing] = useState(false);
  const { colorScheme } = theme;

  const updateColor = (colorHex: string, colorName: string, index: number) => {
    setTheme({
      theme: {
        colorScheme: [...colorScheme.slice(0, index), { colorHex, colorName }, ...colorScheme.slice(index + 1)],
      },
    });
  };

  const addNewColor = () => {
    setTheme({
      theme: {
        colorScheme: [{ colorHex: '#ffffff', colorName: '' }, ...colorScheme],
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
