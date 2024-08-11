import { Block } from '@/lib/exposed-types';

export type HeroProps = {
  padding: string;
};

const Hero: Block<HeroProps> = ({ padding }) => {
  return (
    <div className=" visio-cms-bg-red-100 visio-cms-grid sm:visio-cms-grid-cols-1 md:visio-cms-grid-cols-2 lg:visio-cms-grid-cols-4">
      <div className=" visio-cms-h-[400px] visio-cms-bg-dark-green">{padding}</div>
      <div className=" visio-cms-h-[400px] visio-cms-bg-dark-700">2</div>
      <div className=" visio-cms-h-[400px] visio-cms-bg-dark-800">3</div>
      <div className=" visio-cms-h-[400px] visio-cms-bg-dark-900">4</div>
    </div>
  );
};

Hero.Schema = {
  name: 'hero',
  id: 'Hero',
  group: 'Content',
  sideEditingProps: [],
  defaultPropValues: {
    padding: '10px',
  },
};

export default Hero;
