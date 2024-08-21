import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function RadioGroupController({
  defaultValue,
  onChange,
  options,
}: {
  defaultValue: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <RadioGroup defaultValue={defaultValue} onValueChange={onChange}>
      {options.map(({ label, value }) => (
        <div className="visio-cms-flex visio-cms-items-center visio-cms-space-x-2">
          <RadioGroupItem value={value} id={value} />
          <Label htmlFor={value}>{label}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}
