import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';

export default function ListController({
  defaultValue,
  onChange,
  fields,
}: {
  defaultValue: { [key: string]: any }[];
  onChange: (value: { [key: string]: any }[] | null) => void;
  fields: { name: string; defaultValue: any; itemCount?: number }[];
}) {
  return (
    <div>
      {fields.map((field, index) => {
        const value = defaultValue;
        return (
          <Button
            key={`${field.name}-${index}`}
            variant={'outline'}
            className="visio-cms-mt-2 visio-cms-w-full"
            disabled={value && value.length >= (field?.itemCount || 100)}
            onClick={() => {
              onChange([...defaultValue, { ...field.defaultValue, itemKey: uuidv4() }]);
            }}
          >
            Add {field.name}
          </Button>
        );
      })}
    </div>
  );
}
