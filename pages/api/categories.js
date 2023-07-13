import { Category } from "@/models/Category";
import { mongooseConnect } from "@/lib/connectDB";
import { getServerSession } from "next-auth";
import { authOptions, isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  await isAdminRequest(req, res);

  if (method === "GET") {
    res.json(await Category.find().populate("parent"));
  }

  if (method === "POST") {
    const { name, parentCategory, properties } = req.body;
    const categoryDoc = await Category.create({
      name: name,
      parent: parentCategory || undefined,
      properties: properties,
    });
    res.json(categoryDoc);
  }
  if (method === "PUT") {
    const { name, parentCategory, _id, properties } = req?.body;
    const updatedCategory = await Category.updateOne(
      { _id },
      {
        name: name,
        parent: parentCategory || undefined,
        properties: properties,
      }
    );

    res.json(updatedCategory);
  }

  if (method === "DELETE") {
    const { _id } = req.query;
    await Category.deleteOne({ _id });
    res.json("ok");
  }
}
