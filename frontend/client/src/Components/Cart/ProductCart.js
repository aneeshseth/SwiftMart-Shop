import "./ProductCart.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductCart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);
  const [dict, setDict] = useState({});
  const [images, setImages] = useState([]);
  const [address, setAddress] = useState({});
  const [user, setUser] = useState({});
  const [amount, setAmount] = useState("");
  const handleVerify = async () => {
    const res = await axios.post("http://localhost:3600/ecom/products", {
      search: "",
      withCredentials: true,
    });
    const data = await res.data;
    return data;
  };

  const getTotalCartAmount = async () => {
    const res = await axios.get("http://localhost:3600/ecom/cart/amt");
    const data = await res.data;
    return data;
  };
  const getCartItems = async () => {
    const res = await axios.get("http://localhost:3600/ecom/cart");
    const data = await res.data;
    data.map(async (item) => {
      setCartItems((cart) => [...cart, item]);
      const res = await axios.get(
        `http://localhost:3600/ecom/product/${item.product_id}`
      );
      const data = await res.data;
      setCartProducts((product) => [...product, data.name]);
      setDict((product) => ({ ...product, [data.name]: item.quantity }));
    });
    return data;
  };

  const getShippingAddress = async () => {
    const res = await axios.get("http://localhost:3600/ecom/address");
    const data = await res.data;
    return data[0];
  };
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
  const handleDecrement = async (id, quantity) => {
    if (quantity - 1 < 1) {
      const res = await axios.get(`http://localhost:3600/ecom/products/${id}`);
      const data = await res.data;
      const resP = axios.get(
        `http://localhost:3600/ecom/deleteFromCart/${data[0].id}`
      );
      const dataP = await resP.data;
      return dataP;
    } else {
      const res = await axios.get(`http://localhost:3600/ecom/products/${id}`);
      const data = await res.data;
      const resP = await axios.post(
        `http://localhost:3600/ecom/updateQuantity/${data[0].id}`,
        {
          newQuantity: quantity - 1,
        }
      );
      const dataP = await resP.data;
    }
  };
  const handleIncrement = async (id, quantity) => {
    const res = await axios.get(`http://localhost:3600/ecom/products/${id}`);
    const data = await res.data;
    const resP = await axios.post(
      `http://localhost:3600/ecom/updateQuantity/${data[0].id}`,
      {
        newQuantity: quantity + 1,
      }
    );
    const dataP = await resP.data;
  };
  const handleDelete = async (id) => {
    const res = await axios.get(`http://localhost:3600/ecom/products/${id}`);
    const data = await res.data;
    const resP = axios.get(
      `http://localhost:3600/ecom/deleteFromCart/${data[0].id}`
    );
    const dataP = await resP.data;
    return dataP;
  };
  useEffect(() => {
    handleVerify()
      .then(() => {
        getCartItems();
      })
      .catch(() => {
        Logout();
      });
    getShippingAddress().then((data) => {
      setAddress(data);
    });
    getUser().then((data) => {
      setUser(data);
    });
    getImages(cartProducts);
    getTotalCartAmount().then((data) => {
      setAmount(data);
    });
  }, []);

  const getImages = async (cart) => {
    const res = await axios.post("http://localhost:3600/ecom/getimage", {
      name: cart,
    });
    const data = await res.data;
  };

  const getUser = async () => {
    const res = await axios.get("http://localhost:3600/ecom/user");
    const data = await res.data;
    return data;
  };

  const handleCheckout = async (products) => {
    const res = await axios.post(
      "http://localhost:3600/create-checkout-session",
      {
        products: products,
      }
    );
    const data = await res.data;
    return data;
  };
  return (
    <>
      <div>
        <p>FirstName: {user.firstname}</p>
        <p>LastName: {user.lastname}</p>
        <p>Country: {address.country}</p>
        <p>State: {address.state}</p>
        <p>Street: {address.street}</p>
      </div>
      <div style={{ color: "black", marginTop: "100px" }}>
        {Object.keys(dict).map((keY, index) => (
          <div key={index}>
            <div>
              {keY}: {dict[keY]}
            </div>
            <button
              onClick={() => {
                handleIncrement(keY, dict[keY]).then(() => {
                  window.location.reload();
                });
              }}
            >
              +
            </button>
            <button
              onClick={() => {
                handleDecrement(keY, dict[keY]).then(() => {
                  window.location.reload();
                });
              }}
            >
              -
            </button>
            <button
              onClick={() => {
                handleDelete(keY).then(() => {
                  window.location.reload();
                });
              }}
            >
              Delete
            </button>
          </div>
        ))}
        <div>Total Cost: $ {amount}</div>
        <button
          className="save-button"
          disabled={cartProducts.length == 0}
          onClick={async () => {
            handleCheckout(cartProducts).then((data) => {
              window.location.href = data.url;
            });
          }}
        >
          Checkout
        </button>
      </div>
    </>
  );
}

export default ProductCart;
