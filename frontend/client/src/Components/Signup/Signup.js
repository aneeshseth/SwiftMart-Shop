import React, { useState } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailid, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signUp = async () => {
    try {
      const res = await axios.post("http://localhost:3600/ecom/createUser", {
        firstname: firstName,
        lastname: lastName,
        emailid: emailid,
        password: password,
      });
      const data = res.data;
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    try {
      const data = await signUp();
      console.log(data.id);
      navigate("/products");
    } catch (error) {
      navigate("/");
    }
  };

  return (
    <div className="signup-container">
      <div className="logo-container">
        <img
          src="https://www.freeiconspng.com/uploads/white-tiger-png-23.png"
          alt="Logo"
          className="logo-image"
        />
      </div>
      <div className="signup-form">
        <h2 className="signup-heading">Sign Up</h2>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="email"
          name="email"
          placeholder="Email ID"
          required
          value={emailid}
          onChange={(e) => setEmailId(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="signup-button" onClick={handleSubmit}>
          Sign Up
        </button>
        <Link to="/login" className="login-link">
          Login instead
        </Link>
      </div>
    </div>
  );
}

export default Signup;
