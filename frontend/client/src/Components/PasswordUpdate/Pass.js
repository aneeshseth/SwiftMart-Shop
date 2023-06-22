import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Pass.css";

function Pass() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNew, setConfirmNew] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const handleUpdate = async () => {
    axios
      .put(`http://localhost:3600/ecom/updatePass/${id}`, {
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmNew: confirmNew,
      })
      .then(() => {
        Logout();
      })
      .catch(() => {
        alert("Error in updating!");
        Logout();
      });
  };
  const Logout = async () => {
    const res = axios
      .get("http://localhost:3600/ecom/logoutUser")
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <input
        className="input-box"
        value={oldPassword}
        required
        type="password"
        onChange={(e) => setOldPassword(e.target.value)}
      ></input>
      <input
        className="input-box"
        value={newPassword}
        type="password"
        required
        onChange={(e) => setNewPassword(e.target.value)}
      ></input>
      <input
        className="input-box"
        value={confirmNew}
        type="password"
        required
        onChange={(e) => setConfirmNew(e.target.value)}
      ></input>
      <button
        onClick={handleUpdate}
        disabled={!(oldPassword != "" && newPassword != "" && confirmNew != "")}
      >
        submit
      </button>
    </>
  );
}

export default Pass;
