import axios from "axios";
import { useEffect, useState } from "react";
import "./AdminScreen.css";
import { useNavigate, useParams } from "react-router-dom";

const Circle = ({ text }) => (
  <div className="circle">
    <h2 className="circle-content">{text}</h2>
  </div>
);

function AdminScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [revenue, setRevenue] = useState("");
  const getTotal = async () => {
    const res = await axios.get("http://localhost:3600/ecom/order/total");
    const data = await res.data;
    return data;
  };

  const handleProfile = () => {
    navigate(`/profile/${id}`);
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
      }
    } catch (err) {
      Logout();
      navigate("/");
    }
  };
  const getUser = async () => {
    const res = await axios.get(`http://localhost:3600/ecom/user/${id}`);
    const data = await res.data;
    return data;
  };

  useEffect(() => {
    checkRole(id);
    getTotal().then((data) => {
      setRevenue(data);
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
    <div className="containerr">
      <div>
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
      <div>
        <button
          onClick={() => {
            navigate(`/usersdb/${id}`);
          }}
          className="circle-button"
        >
          <Circle text="Users" />
        </button>
        <button
          onClick={() => {
            navigate(`/productsdb/${id}`);
          }}
          className="circle-button"
        >
          <Circle text="Products" />
        </button>
        <button
          onClick={() => {
            navigate(`/ordersdb/${id}`);
          }}
          className="circle-button"
        >
          <Circle text="Orders" />
        </button>
      </div>
    </div>
  );
}

export default AdminScreen;
