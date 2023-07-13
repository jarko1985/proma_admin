import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";


export default function NewProduct() {
  return (
    <Layout>
      <h1 className="mb-4 font-bold">Create a new Product</h1>
      <ProductForm/>
    </Layout>
  );
}
