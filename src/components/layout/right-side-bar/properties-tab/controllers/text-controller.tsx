import { Input } from '@/components/ui/input';

export default function TextController({
  defaultValue,
  onChange,
}: {
  defaultValue: string;
  onChange: (value: string) => void;
}) {
  return <Input defaultValue={defaultValue} onChange={(e) => onChange(e.target.value)} />;
}
