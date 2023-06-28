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
        alert("Password updated!");
        setOldPassword("");
        setNewPassword("");
        setConfirmNew("");
        window.location.reload();
      })
      .catch(() => {
        alert("Error in updating!");
        setOldPassword("");
        setNewPassword("");
        setConfirmNew("");
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
    <div className="containerr">
      <div className="profile">
        <input
          className="input-box"
          value={oldPassword}
          required
          type="password"
          placeholder="Old Password"
          onChange={(e) => setOldPassword(e.target.value)}
        ></input>
        <input
          className="input-box"
          value={newPassword}
          type="password"
          required
          placeholder="New Password"
          onChange={(e) => setNewPassword(e.target.value)}
        ></input>
        <input
          className="input-box"
          value={confirmNew}
          type="password"
          required
          placeholder="Confirm New Password"
          onChange={(e) => setConfirmNew(e.target.value)}
        ></input>
        <button
          className="submit-button"
          onClick={handleUpdate}
          disabled={
            !(oldPassword !== "" && newPassword !== "" && confirmNew !== "")
          }
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default Pass;
