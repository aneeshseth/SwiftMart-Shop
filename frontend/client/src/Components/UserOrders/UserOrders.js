import React, { useEffect, useState } from "react";
import "./UserOrders.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserOrders() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    const res = await axios.get(`http://localhost:3600/ecom/orders/${id}`);
    const data = await res.data;
    return data;
  };

  useEffect(() => {
    getOrders().then((data) => {
      setOrders(data);
    });
  }, []);
  const handleDelete = async (id) => {
    const res = await axios.get(`http://localhost:3600/ecom/cancel/${id}`);
    const data = await res.data;
    return data;
  };

  const getProductById = async (id) => {
    const res = await axios.get(`http://localhost:3600/ecom/product/${id}`);
    const data = await res.data;
    return data;
  };

  return (
    <div className="admin-home">
      <h1>Orders List:</h1>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>STATUS</th>
              <th>QUANTITY</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.status}</td>
                <td>{product.quantity}</td>
                <td>
                  <button
                    className="button"
                    onClick={() => {
                      getProductById(product.product_id).then((data) => {
                        navigate(`/product/${data.name}`);
                      });
                    }}
                  >
                    Product
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserOrders;
