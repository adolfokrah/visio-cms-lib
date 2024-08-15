import { HexColorPicker } from 'react-colorful';
import { Input } from './input';
import { ProjectConfiguration } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function ColorChooser({
  colorHex = '#ffffff',
  onChange,
}: {
  colorHex?: string;
  onChange: (color: string) => void;
}) {
  const [colors, setColors] = useState<Pick<ProjectConfiguration, 'theme'>['theme']['colorScheme']>([]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      // Check if the change is in sessionStorage
      if (event.storageArea === sessionStorage) {
        const projectConfiguration = JSON.parse(sessionStorage.getItem('project-configuration-storage') || '{}');

        if (projectConfiguration.state.theme.colorScheme) {
          setColors(projectConfiguration.state.theme.colorScheme);
        }
      }
    };

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

      <div className="visio-cms-flex visio-cms-gap-2 visio-cms-flex-wrap visio-cms-my-2 visio-cms-max-h-[200px] visio-cms-overflow-y-auto scrollbar-custom">
        {colors.map(({ colorHex, colorName }) => (
          <Tooltip key={colorName}>
            <TooltipTrigger asChild>
              <div
                style={{ backgroundColor: colorHex }}
                className="visio-cms-w-6 visio-cms-h-6 visio-cms-rounded-full visio-cms-cursor-pointer"
                onClick={() => onChange(colorHex)}
              />
            </TooltipTrigger>
            <TooltipContent>{colorName}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
