import { Block } from '@/lib/exposed-types';

export type HeroProps = {
  padding: string;
};

const Hero: Block<HeroProps> = ({ padding }) => {
  return (
    <div className=" visio-cms-bg-red-100 visio-cms-grid sm:visio-cms-grid-cols-1 md:visio-cms-grid-cols-2 lg:visio-cms-grid-cols-4">
      <div className=" visio-cms-h-[400px] visio-cms-bg-dark-green">{padding}</div>
      <div className=" visio-cms-h-[400px] visio-cms-bg-dark-700">
        2
        <Content />
      </div>
      <div className=" visio-cms-h-[400px] visio-cms-bg-dark-800">3 more is done</div>
      <div className=" visio-cms-h-[400px] visio-cms-bg-orange-400">4</div>
    </div>
  );
};

const Content = () => {
  return <input type="text" placeholder="type something" />;
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
