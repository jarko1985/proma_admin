import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Spinner from "./Spinner";
// import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: exsitingImages,
  category: existingCategory,
  properties:existingProperties
}) {
  const router = useRouter();
  const [poductProperties, setProductProperties] = useState(existingProperties || {});
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [category, setCategory] = useState(existingCategory || "");
  const [images, setImages] = useState(exsitingImages || []);
  const [isUploading, setIsUploading] = useState(false);
  const [goBack, setGoBack] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading,setCategoriesLoading] = useState(false);
  async function uploadImages(event) {
    const files = event.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      setIsUploading(false);
    }
  }
  useEffect(() => {
    setCategoriesLoading(true);
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
      setCategoriesLoading(false);
    });
  }, []);
  async function saveProduct(event) {
    event.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category,
     properties:poductProperties,
    };
    if (_id) {
      await axios.put("/api/products", { ...data, _id });
    } else {
      await axios.post("/api/products", data);
    }
    setGoBack(true);
  }
  // function updateImagesOrder(images) {
  //   setImages(images);
  // }
  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }
  if (goBack) {
    router.push("/products");
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo?.parent._id
      );
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }
  return (
    <form onSubmit={saveProduct}>
      <label htmlFor="product_name">Product Name</label>
      <input
        type="text"
        placeholder="Enter Product name"
        id="product_name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label htmlFor="product_category">Select Product category</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">Please select a Category</option>
        {categories?.length > 0 &&
          categories.map((cat) => <option value={cat._id}>{cat.name}</option>)}
      </select>
      {categoriesLoading &&(
        <Spinner fullWidth={true}/>
      )}
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div className="flex items-center gap-2">
            <div>{p.name}</div>
            <select
              className="mb-1"
              value={poductProperties[p.name]}
              onChange={(ev) => setProductProp(p.name, ev.target.value)}
            >
              {p.values.map((v) => (
                <option value={v}>{v}</option>
              ))}
            </select>
          </div>
        ))}
      <label htmlFor="product_description">Product Description</label>
      <textarea
        id="product_description"
        placeholder="Enter Product discription"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label htmlFor="prduct_pictures">Upload Product Pictures</label>
      <div className="my-2 flex items-center">
        <label className="w-24 h-12 border text-center flex flex-col items-center justify-center p-1 text-gray-600 rounded-md cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Upload</div>
          <input onChange={uploadImages} type="file" className="hidden" />
        </label>
        {/* <ReactSortable list={images} setList={updateImagesOrder}> */}
        {!!images?.length &&
          images.map((link) => (
            <div key={link} className="mx-2">
              <Image
                className="rounded-md"
                src={link}
                alt="product image"
                width={75}
                height={75}
              />
            </div>
          ))}
        {/* </ReactSortable> */}
        {isUploading && (
          <div className="inline-flex">
            <Spinner />
          </div>
        )}
        {!images?.length && (
          <p className="mx-2">No Pictures for this product</p>
        )}
      </div>
      <label htmlFor="product_price">Product Price (in USD)</label>
      <input
        type="number"
        id="product_price"
        placeholder="Enter product size"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
