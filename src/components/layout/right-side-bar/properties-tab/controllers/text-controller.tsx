import { Input } from '@/components/ui/input';

export default function TextController({
  defaultValue,
  onChange,
  type = 'text',
}: {
  defaultValue: string;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'email' | 'password';
}) {
  return <Input defaultValue={defaultValue} type={type} onChange={(e) => onChange(e.target.value)} />;
}
