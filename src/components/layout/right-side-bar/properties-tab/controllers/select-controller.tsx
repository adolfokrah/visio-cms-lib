import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SelectController({
  defaultValue,
  onChange,
  options,
  placeholder,
}: {
  defaultValue: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
}) {
  return (
    <Select defaultValue={defaultValue || 'Select an option'} onValueChange={onChange}>
      <SelectTrigger className="visio-cms-w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(({ label, value }) => (
          <SelectItem value={value}>{label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
