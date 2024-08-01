import SmallerScreenWarning from '../error-pages/smaller-screen-warning-page';

export default function Builder() {
  return (
    <>
      <SmallerScreenWarning />
      <div className="visio-cms-bg-dark-900 visio-cms-hidden lg:visio-cms-block visio-cms-px-3 visio-cms-text-white visio-cms-text-xs visio-cms-h-screen">
        builder heeey!!!
      </div>
    </>
  );
}
