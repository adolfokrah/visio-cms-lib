import { Button } from '@/components/ui/button';
import useColorScheme from '@/lib/hooks/useColorScheme';
import { PlusIcon, Trash } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function ColorScheme() {
  const { colorScheme, addNewColor } = useColorScheme();

  return (
    <div>
      <div className="visio-cms-flex visio-cms-mb-3 visio-cms-justify-between visio-cms-items-center ">
        <p>Colors</p>
        <Button variant={'ghost'} onClick={addNewColor}>
          <PlusIcon size={15} />
        </Button>
      </div>

      {colorScheme.map(({ colorName, colorHex }, index) => (
        <ColorName key={`${colorName}-${index}`} colorName={colorName} colorHex={colorHex} index={index} />
      ))}
    </div>
  );
}

function ColorName({ colorName, colorHex, index }: { colorName: string; colorHex: string; index: number }) {
  const { isEditing, setIsEditing, updateColor, deleteColor } = useColorScheme();

  return (
    <div>
      <div
        className="visio-cms-flex visio-cms-group visio-cms-bg-dark-900 visio-cms-rounded-md visio-cms-p-2 visio-cms-mb-3 visio-cms-items-center visio-cms-justify-between hover:visio-cms-bg-dark-700 visio-cms-cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
      >
        <div className="visio-cms-flex visio-cms-gap-2 visio-cms-items-center">
          <Popover>
            <PopoverTrigger
              asChild
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div
                className="visio-cms-w-6 visio-cms-h-6 visio-cms-rounded-full"
                style={{ backgroundColor: colorHex }}
              />
            </PopoverTrigger>
            <PopoverContent className="visio-cms-w-auto visio-cms-p-0" side="left" align="start" sideOffset={20}>
              <HexColorPicker
                color={colorHex}
                onChange={(newColor) => updateColor(newColor, colorName || colorHex, index)}
              />
              <Input
                key={colorHex}
                defaultValue={colorHex}
                className="visio-cms-mt-2"
                onBlur={(e) => updateColor(e.target.value, colorName || colorHex, index)}
              />
            </PopoverContent>
          </Popover>

          {!isEditing ? (
            <p className="visio-cms-ml-2 visio-cms-truncate visio-cms-whitespace-nowrap">
              {colorName || colorHex.toUpperCase()}
            </p>
          ) : (
            <input
              defaultValue={colorName}
              autoFocus
              className="visio-cms-border-none visio-cms-outline-none visio-cms-bg-transparent"
              onBlur={(e) => updateColor(colorHex, e.target.value || colorHex, index)}
            />
          )}
        </div>

        <AlertDialog>
          <AlertDialogTrigger
            asChild
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Button variant={'ghost'} className="visio-cms-invisible group-hover:visio-cms-visible">
              <Trash size={15} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all instances of this color in your project.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="visio-cms-text-white">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  deleteColor(index);
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
