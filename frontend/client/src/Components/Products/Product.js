import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import "./Product.css";
axios.defaults.withCredentials = true;

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState();
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [TopRatedProducts, setTopRatedProducts] = useState([]);
  const [filter, setFilter] = useState(false);
  const getNumberofCartItems = async () => {
    const res = await axios.get("http://localhost:3600/ecom/cart/count");
    const data = await res.data;
    setCartItemsCount(data);
  };
  const handleVerify = async () => {
    const res = await axios.post("http://localhost:3600/ecom/products", {
      search: search,
      withCredentials: true,
    });
    const data = await res.data;
    setProducts(data);
  };

  const noFilters = async () => {
    navigate({
      search: "",
    });
    const res = await axios.post("http://localhost:3600/ecom/products", {
      search: search,
    });
    const data = await res.data;
    setFilter(false);
    setProducts(data);
  };

  const ascP = async () => {
    const res = await axios.get("http://localhost:3600/ecom/filter/low");
    const data = await res.data;
    setFilter(true);
    setProducts(data);
  };

  const descP = async () => {
    const res = await axios.get("http://localhost:3600/ecom/filter/high");
    const data = await res.data;
    setFilter(true);
    setProducts(data);
  };

  const Footwear = async () => {
    navigate({
      search: "?category=Footwear",
    });
    const res = await axios.get("http://localhost:3600/ecom/filter/specific", {
      params: { category: "Footwear" },
    });
    const data = await res.data;
    setFilter(true);
    setProducts(data);
  };

  const Shirts = async () => {
    navigate({
      search: "?category=Shirts",
    });
    const res = await axios.get("http://localhost:3600/ecom/filter/specific", {
      params: { category: "Shirts" },
    });
    const data = await res.data;
    setFilter(true);
    setProducts(data);
  };

  const Formals = async () => {
    navigate({
      search: "?category=Footwear",
    });
    const res = await axios.get("http://localhost:3600/ecom/filter/specific", {
      params: { category: "Formals" },
    });
    const data = await res.data;
    setFilter(true);
    setProducts(data);
  };

  const getUser = async () => {
    const res = await axios.get(`http://localhost:3600/ecom/user/${id}`);
    const data = await res.data;
    return data;
  };

  const createOrder = async () => {
    const res = await axios.get(`http://localhost:3600/ecom/orderCreate/${id}`);
    const data = await res.data;
    return data;
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      createOrder().then(() => {
        console.log("hi");
        setMessage("Order placed!");
        alert(message);
        navigate(`/products/${id}`);
      });
    }
    getUser()
      .then((data) => {
        if (data.id == null) {
          Logout();
        }
        setUser(data);
      })
      .catch(() => {
        Logout();
      });
    getNumberofCartItems();
    filterByRating();
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    noFilters();
    handleVerify().catch(() => {
      Logout();
    });
  }, [search]);

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
  const filterByRating = async () => {
    const res = await axios.get(
      "http://localhost:3600/ecom/filter/rating/desc"
    );
    const data = await res.data;
    setTopRatedProducts(data);
  };

  const handleProfile = () => {
    navigate(`/profile/${id}`);
  };

  if (isLoading) {
    return (
      <div className="spinner-container">
        <img
          src="https://smhfoundation.ca/wp-content/plugins/interactive-3d-flipbook-powered-physics-engine/assets/images/dark-loader.gif"
          className="spinner"
        />
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="profile-button-container"></div>
      <div className="top-section">
        <div className="search-bar">
          <input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          ></input>
        </div>
        <div className="logout-orders-container">
          <button className="logout-button" onClick={Logout}>
            Logout
          </button>
          <button
            onClick={() => {
              navigate("/cart");
            }}
          >
            Cart
          </button>
          {cartItemsCount > 0 && (
            <span className="cart-items-count">{cartItemsCount}</span>
          )}
          <button
            className="orders-button"
            onClick={() => {
              navigate(`/orders/${id}`);
            }}
          >
            Your Orders
          </button>
          <button className="profile-button" onClick={handleProfile}>
            <img
              src={
                user.profilepic == null
                  ? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  : user.profilepic
              }
              alt="Profile"
              className="profile-image"
            />
          </button>
        </div>
      </div>
      <div className="filter-buttons">
        <button onClick={noFilters}>No filters</button>
        <button onClick={ascP}>Price - Low to High</button>
        <button onClick={descP}>Price - High to Low</button>
        <button onClick={Footwear}>Footwear</button>
        <button onClick={Shirts}>Shirts</button>
        <button onClick={Formals}>Formals</button>
      </div>
      {search === "" && filter == false ? (
        <div>
          <h1 style={{ color: "black" }}>Top Rated Products:</h1>
          <div className="home-page">
            {TopRatedProducts.map((product) => (
              <button
                className="product-button"
                key={product.isbn}
                onClick={() => {
                  navigate(`/product/${product.name}`);
                }}
              >
                <img
                  src={product.images[0]}
                  alt="Product"
                  className="product-image"
                />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <h1 style={{ color: "black" }}>Products Caresoul:</h1>
      <div className="home-page">
        {products.map((product) => (
          <button
            className="product-button"
            key={product.isbn}
            onClick={() => {
              navigate(`/product/${product.name}`);
            }}
          >
            <img
              src={product.images[0]}
              alt="Product"
              className="product-image"
            />
          </button>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
}

export default Product;
