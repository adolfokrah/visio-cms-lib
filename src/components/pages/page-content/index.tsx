import usePageContent from '@/lib/hooks/usePageContent';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';

export default function PageContent() {
  const { activePage } = usePageContent();
  const { blocks } = useProjectConfigurationState();

  return (
    <div className="visio-cms-bg-red-300 lg:visio-cms-flex">
      <div className="visio-cms-h-44 visio-cms-flex-1 sm:visio-cms-bg-dark-800 md:visio-cms-bg-yellow-400 lg:visio-cms-bg-red-300 ">
        {blocks.length}
      </div>
      <div className="visio-cms-h-44 visio-cms-flex-1 visio-cms-bg-red-400">{activePage?.name}</div>
      <div className="visio-cms-h-44 visio-cms-flex-1 visio-cms-bg-red-500">{activePage?.name} </div>
    </div>
  );
}
