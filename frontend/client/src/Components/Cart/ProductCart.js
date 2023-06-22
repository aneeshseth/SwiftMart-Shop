import "./ProductCart.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductCart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);
  const handleVerify = async () => {
    const res = await axios.get("http://localhost:3600/ecom/products", {
      withCredentials: true,
    });
    const data = await res.data;
    return data;
  };
  const getCartItems = async () => {
    const res = await axios.get("http://localhost:3600/ecom/cart");
    const data = await res.data;
    data.map((item) => {
      setCartItems((cart) => [...cart, item]);
      getCartProducts(item.product_id);
    });
    return data;
  };
  const getCartProducts = async (id) => {
    const res = await axios.get(`http://localhost:3600/ecom/product/${id}`);
    const data = await res.data;
    setCartProducts((cart) => [...cart, data[0]]);
  };
  useEffect(() => {
    handleVerify()
      .then(() => {
        getCartItems().catch(() => {
          alert("Error!");
        });
      })
      .catch(() => {
        Logout();
      });
  }, []);
  const Logout = async () => {
    const res = axios
      .get("http://localhost:3600/ecom/logoutUser")
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        navigate("/login");
      });
  };
  return (
    <div>
      {cartProducts.map((item, index) => (
        <div key={item.id}>
          <div style={{ color: "white", marginTop: "125px" }}>
            {item.name} - {cartItems[index].quantity}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductCart;
