import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async () => {
    await fetch("http://localhost:3600/ecom/loginUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailid: email,
        password: password,
      }),
    })
      .then((res) => {
        if (res.status !== 200) {
          alert("invalid id pass");
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (data.token && data.id) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.id);
          navigate("/products");
        } else {
          alert("serverside error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="login-container">
      <h2>Login</h2>
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
      <button onClick={handleLogin} onSubmit={(e) => e.preventDefault()}>
        Login
      </button>
    </div>
  );
}

export default Login;

/*await fetch(`http://localhost:3500/todoApi/delete/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => setTodos(data));*/
