import { Block } from '@/lib/types';

type ProductsListProps = {
    externalData?: {
    products: any[];
    total: number
  }
  totalProducts: number;
};

const ProductsList: React.FC<ProductsListProps> = ({externalData}) => {

  return <div>
    <h1>Products List</h1>
    <p>Total products: {externalData?.total}</p>

    {JSON.stringify(externalData?.products)}
  </div>
};

const ProductsListSchema:Block<ProductsListProps> = {
  component: ProductsList,
  name: 'Products List',
  id: 'products-list',
  sideEditingProps: [],
  defaultPropValues: {
    totalProducts: 10,
  },
  getExternalData: async (props) => {
    //runs on the server in live mode and client in builder
    const res = await fetch('https://fakestoreapi.com/products');
    const products = await res.json();
    return {
      products,
      total: props.totalProducts + 20,
    };
  },
} 

export default ProductsListSchema;
