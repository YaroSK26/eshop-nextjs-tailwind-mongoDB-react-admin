import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import Spinner from "../components/Spinner";


export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  
  const  [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
    axios.get("/api/orders").then((response) => {
      
      setOrders(response.data);
     
      setLoaded(false);
    });
  }, []);
  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Date</th>
            <th>Paid</th>
            <th>Recipient</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {loaded && (
            <tr>
              <td colSpan={4}>
                <div className="p-4">
                  <Spinner fullWidth={true}></Spinner>
                </div>
              </td>
            </tr>
          )}
          {orders.length > 0 &&
            orders.map((order) => (
              <tr key={order._id}>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td className={order.paid ? "text-green-600" : "text-red-600 "}>
                  {order.paid ? "YES" : "NO"}
                </td>
                <td>
                  {order.name} {order.email}
                  <br />
                  {order.city} {order.postalCode} {order.country}
                  <br />
                  {order.streetAddress}
                </td>
                <td>
                  {order.line_items.map((l) => (
                    <div key={order._id}>
                      {l.price_data?.product_data.name} x{l.quantity}
                      <br />
                    </div>
                  ))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}