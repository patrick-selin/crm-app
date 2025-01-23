// pages/products.tsx
import { Title } from "@mantine/core";
import ProductsTest from "../features/products/products-test";


const Products = () => {
  return (
    <div>
      <Title order={1}>Product</Title>
      <ProductsTest />
    </div>
  );
};

export default Products;
