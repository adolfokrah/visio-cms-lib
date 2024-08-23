import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

export default function TextController({
  defaultValue,
  onChange,
  type = 'text',
}: {
  defaultValue: string;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'email' | 'password';
}) {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <Input
      value={value}
      type={type}
      onChange={(e) => {
        onChange(e.target.value);
        setValue(e.target.value);
      }}
    />
  );
}
