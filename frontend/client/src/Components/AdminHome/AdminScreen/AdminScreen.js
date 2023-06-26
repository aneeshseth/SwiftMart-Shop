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
  const [revenue, setRevenue] = useState("");
  const getTotal = async () => {
    const res = await axios.get("http://localhost:3600/ecom/order/total");
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
      }
    } catch (err) {
      Logout();
      navigate("/");
    }
  };

  useEffect(() => {
    checkRole(id);
    getTotal().then((data) => {
      setRevenue(data);
    });
  }, []);

  return (
    <div className="container">
      <button onClick={Logout} className="logout-button">
        Logout
      </button>
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
        <Circle text={"Total Revenue: $" + revenue} />
      </div>
    </div>
  );
}

export default AdminScreen;
