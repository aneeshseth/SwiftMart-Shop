import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ProductsDB.css";
function ProductsDB() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const handleVerify = async () => {
    const res = await axios.post("http://localhost:3600/ecom/products", {
      search: "",
      withCredentials: true,
    });
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

  const checkRole = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3600/ecom/role/${id}`);
      if (res.data !== "admin") {
        Logout();
      } else {
        const data = await handleVerify();
        setProducts(data);
      }
    } catch (err) {
      Logout();
      navigate("/");
    }
  };
  const handleDelete = async (id) => {
    const res = axios
      .delete(`http://localhost:3600/ecom/deleteProduct/${id}`)
      .then((data) => {
        console.log(data);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    checkRole(id);
  }, []);

  return (
    <div className="admin-home">
      <h1>Product List:</h1>
      <button
        onClick={() => {
          navigate("/add");
        }}
      >
        Add Product
      </button>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>ISBN</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  <button className="button">{product.name}</button>
                </td>
                <td>{product.category}</td>
                <td>{product.price}</td>
                <td>{product.isbn}</td>
                <th>
                  <button
                    onClick={() => {
                      navigate(`/edit/product/${product.id}`);
                    }}
                  >
                    Edit
                  </button>
                </th>
                <th>
                  <button
                    onClick={() => {
                      handleDelete(product.id);
                    }}
                  >
                    Delete
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

export default ProductsDB;
