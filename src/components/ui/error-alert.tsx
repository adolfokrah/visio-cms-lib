import { Alert, AlertTitle } from '@/components/ui/alert';
import { BanIcon, X } from 'lucide-react';
import { Button } from './button';

export default function ErrorAlert({
  errorMessage,
  onClearError,
  className,
}: {
  errorMessage?: string;
  onClearError: () => void;
  className?: string;
}) {
  if (!errorMessage) return null;

  return (
    <Alert variant={'destructive'} className={className}>
      <div className="visio-cms-flex  visio-cms-items-center visio-cms-justify-between">
        <div className="visio-cms-flex visio-cms-gap-2 visio-cms-items-center ">
          <BanIcon color="hsl(var(--visio-cms-destructive))" className="visio-cms-w-4 visio-cms-h-4" />
          <AlertTitle className="!visio-cms-m-0">{errorMessage}</AlertTitle>
        </div>
        <Button variant="ghost" onClick={() => onClearError()} className="!visio-cms-p-0 !visio-cms-bg-transparent">
          <X className="visio-cms-w-4 visio-cms-h-4 visio-cms-text-gray-300" />
        </Button>
      </div>
    </Alert>
  );
}
