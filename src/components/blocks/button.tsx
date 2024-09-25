import { Block } from '@/lib/types';
import { Button } from '../ui/button';

const ButtonBlock: Block = () => {
  return <Button>Click me</Button>;
};

ButtonBlock.Schema = {
  name: 'button',
  id: 'button',
  sideEditingProps: [],
  defaultPropValues: {},
};

export default ButtonBlock;
