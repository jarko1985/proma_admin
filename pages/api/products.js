import { mongooseConnect } from "@/lib/connectDB";
import { Product } from "@/models/Product";
import { isAdminRequest } from "./auth/[...nextauth]";


export default async function handle(req, res) {
  const { method } = req;
 await mongooseConnect();
 await isAdminRequest(req,res);
  if(method === "GET"){
    if(req.query?.id){
     return res.json(await Product.findOne({_id:req.query.id}))
    }
    const allProducts = await Product.find(); 
    return res.json(allProducts)
  }
  if (method === "POST") {
    const { title, description, price,images,category,properties} = req.body;
    const productDoc =  await Product.create({
      title,
      description,
      price,
      images,
      category,
      properties
    });
   
  return res.json(productDoc);   
  }
  if(method === "PUT"){
    const { title, description, price,_id,images,category,properties } = req.body; 
    await Product.updateOne({_id},{title,description,price,images,category,properties});
   return res.json(true)
  }
  if(method === "DELETE"){
    if(req.query?.id){
      await Product.deleteOne({_id:req.query.id})
     return res.json(true)
    }
  }
}
