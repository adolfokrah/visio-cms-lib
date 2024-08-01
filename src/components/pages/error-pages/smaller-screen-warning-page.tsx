import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

export default function SmallerScreenWarning() {
  return (
    <div className="visio-cms-bg-dark-900  visio-cms-px-3 visio-cms-text-white visio-cms-text-xs visio-cms-h-screen visio-cms-flex visio-cms-items-center visio-cms-place-content-center   lg:visio-cms-hidden">
      <Card className="visio-cms-w-full sm:visio-cms-w-[400px]">
        <CardHeader>
          <CardTitle className="visio-cms-text-lg visio-cms-flex visio-cms-gap-2 visio-cms-items-center">
            <Info />
            Smaller screen size detected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="visio-cms-text-gray-300">
            To ensure a comprehensive and user-friendly experience, the builder is optimized for larger screen sizes.
            For the best overview and functionality, we recommend accessing the builder on a desktop or other larger
            display.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
