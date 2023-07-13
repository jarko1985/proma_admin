import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProduct() {
  const [productInfo, setProductInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    } else {
      axios.get("/api/products?id=" + id).then((response) => {
        setProductInfo(response.data);
      });
    }
  }, [id]);
  function goBack() {
    router.push("/products");
  }

 async function deleteProduct(){
   await axios.delete('/api/products?id='+id);
   goBack();
  }
  return (
    <Layout>
      <h1 className="mb-4 font-bold text-center">
        Do you really want to delete this product "{productInfo?.title}"?
      </h1>
      <div className="flex justify-center">
        <button 
        onClick={deleteProduct}
        className="text-white rounded-md px-2 py-1 inline-flex m-1 bg-green-700 hover:bg-white hover:text-green-700 hover:border-solid border-2 hover:border-green-700">
          YES
        </button>
        <button
          className="text-white rounded-md px-2 py-1 inline-flex m-1 bg-red-700 hover:bg-white hover:text-red-700 hover:border-solid border-2 hover:border-red-700"
          onClick={goBack}
        >
          NO
        </button>
      </div>
    </Layout>
  );
}
