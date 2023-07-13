import { mongooseConnect } from "@/lib/connectDB";
import { Order } from "@/models/Order";

export default async function handle(req, res) {

await mongooseConnect();
res.json(await Order.find().sort({ceatedAt:-1}));

}