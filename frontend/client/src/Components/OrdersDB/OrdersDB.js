import "./OrdersDB.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function OrdersDB() {
  const checkRole = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3600/ecom/role/${id}`);
      if (res.data !== "admin") {
        Logout();
      }
    } catch (err) {
      Logout();
      navigate("/");
    }
  };
  const navigate = useNavigate();
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const getOrders = async () => {
    const res = await axios.get(`http://localhost:3600/ecom/orders/`);
    const data = await res.data;
    return data;
  };
  const Logout = async () => {
    try {
      await axios.get("http://localhost:3600/ecom/logoutUser");
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    checkRole(id);
    getOrders().then((data) => {
      setOrders(data);
    });
  });
  const handleDelete = async (id) => {
    const res = await axios.get(`http://localhost:3600/ecom/cancel/${id}`);
    const data = await res.data;
    return data;
  };
  return (
    <div className="admin-home">
      <h1>Orders List:</h1>
      <button onClick={Logout} className="logout">
        Logout
      </button>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>STATUS</th>
              <th>QUANTITY</th>
              <th>OPTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.status}</td>
                <td>{product.quantity}</td>
                <th>
                  <button
                    className="order"
                    onClick={() => {
                      navigate(`/order/${product.id}`);
                    }}
                  >
                    View
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(product.id).then(() => {
                        window.location.reload();
                      });
                    }}
                  >
                    Cancel
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrdersDB;
