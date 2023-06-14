import React, { useState } from "react";
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

  const handleLogin = async () => {
    try {
      await login();
      navigate("/products");
    } catch (error) {
      navigate("/login");
    }
  };

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
