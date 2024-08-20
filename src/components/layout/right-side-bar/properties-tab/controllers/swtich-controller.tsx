import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function SwitchController({
  defaultValue,
  onChange,
  onLabel,
  offLabel,
}: {
  defaultValue: boolean;
  onChange: (value: boolean) => void;
  onLabel: string;
  offLabel: string;
}) {
  return (
    <div className="visio-cms-flex visio-cms-items-center visio-cms-space-x-2">
      <Switch id="switch" onCheckedChange={onChange} />

      <Label htmlFor="switch">{defaultValue ? onLabel || 'True' : offLabel || 'False'}</Label>
    </div>
  );
}
