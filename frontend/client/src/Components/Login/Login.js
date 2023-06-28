import React, { useEffect, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:3600/ecom/loginUser", {
        emailid: email,
        password: password,
      });
      const data = await res.data;
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const [isLoading, setIsLoading] = useState(true);

  const checkRole = async (id) => {
    const res = await axios
      .get(`http://localhost:3600/ecom/role/${id}`)
      .then((data) => {
        if (data.data === "admin") {
          navigate(`/adminscreen/${id}`);
        } else {
          navigate(`/products/${id}`);
        }
      })
      .catch(() => {
        alert("login issue");
        navigate("/login");
      });
  };

  const handleLogin = async () => {
    if (email === "" || password === "") {
      alert("Enter all fields!");
    } else {
      try {
        await login().then((data) => {
          checkRole(data.id);
        });
      } catch (error) {
        alert("Invalid!");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="spinner-container">
        <img
          src="https://smhfoundation.ca/wp-content/plugins/interactive-3d-flipbook-powered-physics-engine/assets/images/dark-loader.gif"
          className="spinner"
          alt="Loading..."
        />
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-heading">Login</h2>
        <div className="credentials">
          <strong>Admin Email: </strong>aneeshseth2018@gmail.com
        </div>
        <div className="credentials">
          <strong>Admin Password:</strong> doll@2107
        </div>
        <div className="credentials">
          <strong>User Email:</strong> sethprachi3839@gmail.com
        </div>
        <div className="credentials last">
          <strong>User Password: </strong>doll@2107
        </div>
        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
        <Link to="/" className="signup-link">
          Sign Up instead
        </Link>
      </div>
    </div>
  );
}

export default Login;
