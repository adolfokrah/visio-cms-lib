import { Block } from '@/lib/exposed-types';

export type HeroProps = {
  padding: string;
};

const Hero: Block<HeroProps> = ({ padding }) => {
  return <div className=" visio-cms-h-auto">{padding}</div>;
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
