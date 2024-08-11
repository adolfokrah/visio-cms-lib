import { Block } from '@/lib/exposed-types';

export type HeroProps = {
  padding: string;
};

const Hero: Block<HeroProps> = ({ padding }) => {
  return <div className="visio-cms-h-[200px] visio-cms-bg-red-100">Hello {padding}</div>;
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
