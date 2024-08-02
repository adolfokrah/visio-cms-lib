import { usePagesState } from '@/lib/states/usePagesState';

export default function IframeView() {
  const { selectedPage } = usePagesState();
  return (
    <div className="visio-cms-mt-3 visio-cms-h-full visio-cms-bg-red-300 visio-cms-rounded-md">{selectedPage}</div>
  );
}
