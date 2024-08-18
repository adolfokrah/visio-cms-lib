import ColorChooser from '@/components/ui/color-chooser';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import { Color } from '@/lib/types';
import { useMemo } from 'react';

export default function ColorController({
  defaultValue,
  onChange,
}: {
  defaultValue: Color;
  onChange: (value: Color) => void;
}) {
  const { theme } = useProjectConfigurationState();
  const color = useMemo(
    () => theme.colorScheme.find((color) => color.id === defaultValue?.id) || defaultValue,
    [theme.colorScheme, defaultValue],
  );
  return (
    <div className="visio-cms-flex visio-cms-group visio-cms-bg-dark-900 visio-cms-rounded-md visio-cms-p-2 visio-cms-mb-3 visio-cms-items-center visio-cms-justify-between hover:visio-cms-bg-dark-700 visio-cms-cursor-pointer">
      <div className="visio-cms-flex visio-cms-gap-2 visio-cms-items-center visio-cms-flex-1">
        <Popover>
          <PopoverTrigger
            asChild
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div
              className="visio-cms-w-6 visio-cms-h-6 visio-cms-rounded-full visio-cms-flex-shrink-0"
              style={{ backgroundColor: color?.colorHex }}
            />
          </PopoverTrigger>
          <PopoverContent className="visio-cms-w-auto visio-cms-p-0" side="left" align="start" sideOffset={20}>
            <ColorChooser
              colorHex={color?.colorHex}
              onChange={(color) => {
                if (typeof color != 'string') {
                  onChange({ colorHex: color.colorHex, colorName: color.colorName, id: color.id });
                  return;
                }
                onChange({ colorHex: color, colorName: color, id: color });
              }}
            />
          </PopoverContent>
        </Popover>

        <div className="visio-cms-w-[calc(100%-50px)]">
          <p className="visio-cms-ml-2 visio-cms-truncate visio-cms-whitespace-nowrap">
            {color?.colorName || color?.colorHex}
          </p>
        </div>
      </div>
    </div>
  );
}
