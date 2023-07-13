import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";
import {withSwal} from 'react-sweetalert2'
import Spinner from "@/components/Spinner";
 function Categories({swal}) {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [editedCategory,setEditedCategory] = useState(null);
  const [properties,setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    fetchCategries();
  }, []);

  function fetchCategries() {
    setIsLoading(true);
    axios.get("/api/categories").then((response) => {
      setCategories(response.data);
      setIsLoading(false);
    });
  }
  async function saveCategory(event) {
    event.preventDefault();
    const data ={
      name,
      parentCategory,
      properties:properties.map(p=>({
        name:p.name,
        values:p.values.split(','),
      }))
    };
    if(editedCategory){
        data._id = editedCategory._id;
        await axios.put('/api/categories',data);
        setEditedCategory(null)
    }else{
        await axios.post("/api/categories",data);
    }
   
    setName("");
    setParentCategory("");
    setProperties([]);
    fetchCategries();
  }
  function editCategory(category){
    setEditedCategory(category) ;
    setName(category.name);
    setParentCategory(category?.parent?._id);
    setProperties(category.properties.map(({name,values})=>({
      name,
      values:values.join(',')
    }))
    )
  }
  function deleteCategory(category){
    swal.fire({
         title:"Are you Sure?",
         text:`Do you want to delete ${category.name}`,
         showCancelButton:true,
         cancelButtonText:'Cancel',
         confirmButtonText:'Yes, Delete!',
         confirmButtonColor:'red',
         reverseButtons:true,
    }).then(async result=>{
        if(result.isConfirmed){
            const {_id} = category;
          await axios.delete('/api/categories?_id='+_id);
          fetchCategries();
        }
    })
  }
  function addProperty(){
    setProperties(prev=>{
      return [...prev,{name:'',values:""}]
    })
  }
  function handlePropertyNameChange(index,property,newName){
    setProperties(prev=>{
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    })
  }

  function handlePropertyValueschange(index,property,newvalues){
    setProperties(prev=>{
      const properties = [...prev];
      properties[index].values = newvalues;
      return properties;
    })

  }

  function removeProperty(indexoRemove){
    setProperties(prev=>{
      const newProperties = [...prev];
      return [...prev].filter((p,pIndex)=>{return pIndex !== indexoRemove});
    })
  }
  return (
    <Layout>
      <h1 className="text-2xl my-2">Categories</h1>
      <label>{editedCategory ? `Edit Category ${editedCategory.name}` : "Add A New Category" }  </label>
      <form onSubmit={saveCategory} className=" gap-2 my-2 ">
        <div className="flex gap-1">
        <input
          type="text"
          placeholder="Enter a category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          value={parentCategory}
          onChange={(e) => setParentCategory(e.target.value)}
        >
          <option value=" ">No Parent Category</option>
          {categories.length > 0 &&
            categories.map((category) => (
              <option value={category._id}>{category.name}</option>
            ))}
        </select>
        </div>
        <div>
        <label className="block">Properties</label> 
        <button onClick={addProperty} type="button" className="bg-green-600 text-white px-2 py-1 rounded-md my-3">Add New Property</button> 
        {properties.length>0 && properties.map((property,index)=>(
          <div className="flex gap-1 items-center">
            <input value={property.name} onChange={(ev)=>handlePropertyNameChange(index,property,ev.target.value)} type="text" placeholder="Property Name (i.e Color,Size,...Etc)"/>
            <input value={property.values} onChange={(ev)=>handlePropertyValueschange(index,property,ev.target.value)} type="text" placeholder="insert values, comma separated"/>
            <button type="button" onClick={()=>removeProperty(index)} className="bg-red-700 px-2 py-1 mb-3 rounded-md cursor-pointer text-white">Remove</button>
          </div> 
        ))}
        </div>  
        <div className="flex gap-1">
        {editedCategory && (
          <button type="button" onClick={()=>{setEditedCategory(null); setName(""); setParentCategory("")}} className="bg-red-600 text-white rounded-md px-2 py-1 mb-3">Cancel</button>
        )}    
        
        <button type="submit" className="btn-primary mb-3">
          Save
        </button>
        </div>
        
      </form>
      {!editedCategory && (
          <table className="basic">
          <thead>
            <tr>
              <td>Category Name</td>
              <td>Parent Category(If Any) </td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={3}>
                  <div className="py-4">
                    <Spinner fullWidth={true}/>
                  </div>
                </td>
              </tr>
            )}
            {categories.length > 0 &&
              categories.map((el) => (
                <tr>
                  <td>{el.name}</td>
                  <td>{el?.parent?.name}</td>
                  <td className="flex justify-center"> 
                  <button onClick={()=>editCategory(el)} className="btn-primary flex edit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  <span>Edit</span>
                  </button>
                  <button
                   onClick={()=>deleteCategory(el)}   
                   className="btn-primary flex delete"
                   >
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>    
                  <span>Delete</span>
                  </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
      
    </Layout>
  );
}

export default withSwal(({swal,ref})=>(
    <Categories swal={swal}/>
))