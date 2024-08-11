import useIframe from '@/lib/hooks/useIframe';

export default function PageContent() {
  const { message } = useIframe(true);

  return (
    <div className="visio-cms-bg-red-300 lg:visio-cms-flex">
      <div className="visio-cms-h-44 visio-cms-flex-1 sm:visio-cms-bg-dark-800 md:visio-cms-bg-yellow-400 lg:visio-cms-bg-red-300 ">
        page Content {message}
      </div>
      <div className="visio-cms-h-44 visio-cms-flex-1 visio-cms-bg-red-400">page Content {message}</div>
      <div className="visio-cms-h-44 visio-cms-flex-1 visio-cms-bg-red-500">page Content {message}</div>
    </div>
  );
}
