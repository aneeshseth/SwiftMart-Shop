import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailid, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSignup = async () => {
    await fetch("http://localhost:3600/ecom/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname: firstName,
        lastname: lastName,
        emailid: emailid,
        password: password,
      }),
    })
      .then((res) => {
        if (res.status !== 201) {
          alert("a user with this emailid already exists");
        }
        return res.json();
      })
      .then((data) => {
        if (data.id && data.token) {
          localStorage.setItem("userId", data.id);
          localStorage.setItem("token", data.token);
          navigate("/products");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
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
      <button onClick={handleSignup}> Sign Up </button>
    </div>
  );
}

export default Signup;
