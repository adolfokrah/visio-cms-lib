import { Block } from '@/lib/exposed-types';
import Tiptap from '../ui/tiptap/tiptap';

export type HeroProps = {
  padding: string;
};

const Hero: Block<HeroProps> = ({ padding }) => {
  return (
    <div className=" visio-cms-h-auto">
      <Tiptap />
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
