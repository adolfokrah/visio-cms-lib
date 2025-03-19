import { Block } from '@/lib/types';
import { Button } from '../ui/button';

const ButtonBlock = () => {
  return <Button>Click me</Button>;
};

const ButtonBlockSchema:Block = {
  name: 'button',
  id: 'button',
  sideEditingProps: [],
  defaultPropValues: {},
  component: ButtonBlock
};

export default ButtonBlockSchema;
