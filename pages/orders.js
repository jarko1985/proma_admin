import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Orders() {

  const [orders,setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    setIsLoading(true);
   axios.get('/api/orders').then(response=>{
    setOrders(response.data);
    setIsLoading(false)
   })
  },[])
  return <Layout>
          <table className="basic">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Paid</th>
                <th>Recipient</th>
                <th>Products</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5}>
                    <div className="py-4">
                    <Spinner fullWidth={true}/>
                    </div>
                  </td>
              </tr>
              )}
              

              {orders.length > 0 && orders.map(order=>(
                <tr>
                  <td>{order._id}</td>
                  <td>{(new Date(order.createdAt)).toLocaleString()} Gulf Time</td>
                  {order.paid ? (<td style={{backgroundColor:'#32CD32'}}>Yes</td>):(<td style={{backgroundColor:'#e34234'}}>No</td>)}
                  <td>{order.name}{order.email}<br/>
                      {order.city}{order.postalCode}{order.country}<br/>
                      {order.street}
                  </td> 
                  <td>
                    {order.line_items.map(l=>(
                      <>
                      {l.price_data.product_data.name} X {l.quantity}
                      </>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
  </Layout>;
}
