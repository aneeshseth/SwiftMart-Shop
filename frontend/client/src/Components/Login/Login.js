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
      const data = res.data;
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
          navigate(`/admin/${id}`);
        } else {
          navigate(`/products/${id}`);
        }
      })
      .catch(() => {
        console.log("hi");
        navigate("/");
      });
  };

  const handleLogin = async () => {
    try {
      await login().then((data) => {
        checkRole(data.id);
      });
    } catch (error) {
      alert("Invalid!");
      navigate("/login");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  });
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
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-heading">Login</h2>
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
