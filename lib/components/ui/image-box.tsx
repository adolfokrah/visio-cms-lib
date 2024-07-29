'use client';

import { Button } from './button';
import { RefreshCcw, Trash } from 'lucide-react';

const ImageBox = (props: { imageSrc?: string }) => {
  const { imageSrc } = props;

  return (
    <div
      className={
        'visio-cms-bg-dark-900 visio-cms-rounded-md visio-cms-p-2 visio-cms-relative visio-cms-h-60 visio-cms-w-full'
      }
    >
      <img src={imageSrc} className="visio-cms-w-full visio-cms-h-full visio-cms-rounded-md" />

      <div className="visio-cms-absolute visio-cms-w-full visio-cms-h-full visio-cms-grid visio-cms-place-items-center visio-cms-top-0 visio-cms-left-0">
        <div className="visio-cms-flex visio-cms-gap-2 visio-cms-justify-center">
          <Button className="!visio-cms-rounded-full !visio-cms-bg-dark-900 hover:!visio-cms-bg-dark-800 visio-cms-h-11 visio-cms-w-11">
            <Trash size={16} />
          </Button>
          <Button className="!visio-cms-rounded-full !visio-cms-bg-dark-900 hover:!visio-cms-bg-dark-800 visio-cms-h-11 visio-cms-w-11">
            <RefreshCcw size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export { ImageBox };
