import { Block } from '@/lib/exposed-types';

const Navbar: Block = () => {
  return <div>Navbar</div>;
};

Navbar.Schema = {
  name: 'Navbar',
  id: 'navbar',
  sideEditingProps: [],
  defaultPropValues: {},
  group: 'Navigation',
};

export default Navbar;
