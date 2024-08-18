import { HexColorPicker } from 'react-colorful';
import { Input } from './input';
import { Color, ProjectConfiguration } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function ColorChooser({
  colorHex = '#ffffff',
  onChange,
  isFromTiptap = false,
}: {
  colorHex?: string;
  onChange: (color: string | Color) => void;
  isFromTiptap?: boolean;
}) {
  const [colors, setColors] = useState<Pick<ProjectConfiguration, 'theme'>['theme']['colorScheme']>([]);

  useEffect(() => {
    const getColors = () => {
      const projectConfiguration = JSON.parse(sessionStorage.getItem('project-configuration-storage') || '{}');

      if (projectConfiguration.state.theme.colorScheme) {
        setColors(projectConfiguration.state.theme.colorScheme);
      }
    };
    const handleStorageChange = (event: StorageEvent) => {
      // Check if the change is in sessionStorage
      if (event.storageArea === sessionStorage) {
        getColors();
      }
    };

    getColors();

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div>
      <HexColorPicker color={colorHex} onChange={(newColor) => onChange(newColor)} />
      <Input
        key={colorHex}
        defaultValue={colorHex}
        className="visio-cms-mt-2"
        onBlur={(e) => onChange(e.target.value)}
      />

      {!isFromTiptap && (
        <div className="visio-cms-flex visio-cms-gap-2 visio-cms-flex-wrap visio-cms-my-2 visio-cms-max-h-[200px] visio-cms-overflow-y-auto scrollbar-custom">
          {colors.map((color) => (
            <Tooltip key={color.colorName}>
              <TooltipTrigger asChild>
                <div
                  style={{ backgroundColor: color.colorHex }}
                  className="visio-cms-w-6 visio-cms-h-6 visio-cms-rounded-full visio-cms-cursor-pointer"
                  onClick={() => onChange(color)}
                />
              </TooltipTrigger>
              <TooltipContent>{color.colorName}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
}
