import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./Product.css";
axios.defaults.withCredentials = true;

function Product() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const handleVerify = async () => {
    const res = await axios.get("http://localhost:3600/ecom/products", {
      withCredentials: true,
    });
    const data = await res.data;
    return data;
  };
  useEffect(() => {
    handleVerify()
      .then((data) => {
        setProducts(data);
      })
      .catch(() => {
        navigate("/");
      });
  }, []);
  const Logout = async () => {
    const res = axios
      .get("http://localhost:3600/ecom/logoutUser")
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <div className="home_page">
        <h4>
          '' Welcome <span>user</span>
        </h4>
        {products.map((product) => (
          <img src={product.images[0]} key={product.isbn} />
        ))}
        <button onClick={Logout}>LOGOUT</button>
      </div>
      <ToastContainer />
    </>
  );
}

export default Product;
