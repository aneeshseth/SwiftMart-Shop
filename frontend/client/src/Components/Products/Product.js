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

  const RangeSlider = ({ min, max, value, step, onChange }) => {
    const [minValue, setMinValue] = useState(value ? value.min : min);
    const [maxValue, setMaxValue] = useState(value ? value.max : max);

    useEffect(() => {
      if (value) {
        setMinValue(value.min);
        setMaxValue(value.max);
      }
    }, [value]);

    const handleMinChange = (e) => {
      e.preventDefault();
      const newMinVal = Math.min(+e.target.value, maxValue - step);
      if (!value) setMinValue(newMinVal);
      onChange({ min: newMinVal, max: maxValue });
    };

    const handleMaxChange = (e) => {
      e.preventDefault();
      const newMaxVal = Math.max(+e.target.value, minValue + step);
      if (!value) setMaxValue(newMaxVal);
      onChange({ min: minValue, max: newMaxVal });
    };

    const minPos = ((minValue - min) / (max - min)) * 100;
    const maxPos = ((maxValue - min) / (max - min)) * 100;

    return (
      <div className="wrapper">
        <div className="input-wrapper">
          <input
            className="input"
            type="range"
            value={minValue}
            min={min}
            max={max}
            step={step}
            onChange={handleMinChange}
          />
          <input
            className="input"
            type="range"
            value={maxValue}
            min={min}
            max={max}
            step={step}
            onChange={handleMaxChange}
          />
        </div>

        <div className="control-wrapper">
          <div className="control" style={{ left: `${minPos}%` }} />
          <div className="rail">
            <div
              className="inner-rail"
              style={{ left: `${minPos}%`, right: `${100 - maxPos}%` }}
            />
          </div>
          <div className="control" style={{ left: `${maxPos}%` }} />
        </div>
      </div>
    );
  };
  const minimumValue = 0;
  const maximumValue = 500;
  const [value, setValue] = useState({ min: 0, max: 500 });

  const getProducts = async () => {
    const res = await axios.get("http://localhost:3600/ecom/products/range", {
      params: {
        low: value.min,
        high: value.max,
      },
    });
    const data = await res.data;
    console.log(data);
    setProducts(data);
  };

  const handleVerify = async () => {
    const res = await axios.get("http://localhost:3600/ecom/products", {
      withCredentials: true,
    });
    const data = await res.data;
    setProducts(data);
  };

  const noFilters = async () => {
    value.min = minimumValue;
    value.max = maximumValue;
    navigate({
      search: "",
    });
    const res = await axios.get("http://localhost:3600/ecom/products");
    const data = await res.data;
    setProducts(data);
  };

  const ascP = async () => {
    value.min = minimumValue;
    value.max = maximumValue;
    const res = await axios.get("http://localhost:3600/ecom/filter/low");
    const data = await res.data;
    console.log(data);
    setProducts(data);
  };

  const descP = async () => {
    value.min = minimumValue;
    value.max = maximumValue;
    const res = await axios.get("http://localhost:3600/ecom/filter/high");
    const data = await res.data;
    setProducts(data);
  };

  const Footwear = async () => {
    value.min = minimumValue;
    value.max = maximumValue;
    navigate({
      search: "?category=Footwear",
    });
    const res = await axios.get("http://localhost:3600/ecom/filter/specific", {
      params: { category: "Footwear" },
    });
    const data = await res.data;
    setProducts(data);
  };

  const Shirts = async () => {
    value.min = minimumValue;
    value.max = maximumValue;
    navigate({
      search: "?category=Shirts",
    });
    const res = await axios.get("http://localhost:3600/ecom/filter/specific", {
      params: { category: "Shirts" },
    });
    const data = await res.data;
    setProducts(data);
  };

  const Formals = async () => {
    value.min = minimumValue;
    value.max = maximumValue;
    navigate({
      search: "?category=Footwear",
    });
    const res = await axios.get("http://localhost:3600/ecom/filter/specific", {
      params: { category: "Formals" },
    });
    const data = await res.data;
    setProducts(data);
  };

  const getUser = async () => {
    const res = await axios.get(`http://localhost:3600/ecom/user/${id}`);
    const data = await res.data;
    return data;
  };

  useEffect(() => {
    handleVerify().catch(() => {
      Logout();
    });
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
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (value.min !== minimumValue || value.max !== maximumValue) {
      getProducts();
    } else {
      handleVerify();
    }
  }, [value]);
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
  const handleProfile = () => {
    navigate(`/profile/${id}`);
  };
  if (isLoading) {
    return (
      <div className="spinner-container">
        <img
          src="https://media0.giphy.com/media/uGonwW6vqUTI15DKmj/giphy.gif?cid=6c09b952ccb7b2b1e773c3ed04c9cd8d14194335b49b6877&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=s"
          className="spinner"
        />
      </div>
    );
  }
  return (
    <div className="products_page">
      <div className="profile-button-container">
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
      <div style={{ marginTop: "25px" }}>
        <button onClick={noFilters}>No filters</button>
        <button onClick={ascP}>Price - Low to High</button>
        <button onClick={descP}>Price - High to Low</button>
        <button onClick={Footwear}>Footwear</button>
        <button onClick={Shirts}>Shirts</button>
        <button onClick={Formals}>Formals</button>
      </div>
      <div>
        <RangeSlider
          min={0}
          max={100}
          step={5}
          value={value}
          onChange={setValue}
        />
      </div>

      <div className="home_page">
        {products.map((product) => (
          <button
            className="button"
            key={product.isbn}
            onClick={() => {
              navigate(`/product/${product.name}`);
            }}
          >
            <img src={product.images[0]} alt="Product" />
          </button>
        ))}
        <button onClick={Logout}>LOGOUT</button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Product;
/*

*/
