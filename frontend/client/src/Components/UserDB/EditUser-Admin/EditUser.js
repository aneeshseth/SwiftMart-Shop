import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./EditUser.css";
import axios from "axios";
import { CountrySelect, StateSelect } from "react-country-state-city";
import { useNavigate } from "react-router-dom";

function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [address, setAddress] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [street, setStreet] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [countryid, setCountryid] = useState(0);
  const [stateid, setStateid] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState("");

  const getUser = async () => {
    const res = await axios.get(`http://localhost:3600/ecom/user/${id}`);
    const data = await res.data;
    return data;
  };
  const getAddress = async () => {
    const res = await axios.get(`http://localhost:3600/ecom/address/${id}`);
    const data = await res.data;
    return data;
  };

  useEffect(() => {
    getUser().then((data) => {
      setUser(data);
      setRole(data.role);
      setIsLoading(false);
    });
    getAddress().then((data) => {
      setAddress(data[0]);
    });
  }, []);

  const formChange = () => {
    if (
      firstName === "" &&
      lastName === "" &&
      emailId === "" &&
      role === user.role &&
      street === "" &&
      (country === "" || state === "")
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `http://localhost:3600/ecom/updateUserAdmin/${id}`,
        {
          firstname: firstName === "" ? user.firstname : firstName,
          lastname: lastName === "" ? user.lastname : lastName,
          emailid: emailId === "" ? user.emailid : emailId,
          role: role === "" ? user.role : role,
          street: street === "" ? address.street : street,
          country: country === "" ? address.country : country,
          state: state === "" ? address.state : state,
        }
      );
      const data = await res.data;
      return data;
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error in updating!");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  return (
    <div className="outer-div">
      <div className="input-div">
        <input
          className="input-box"
          placeholder={user.firstname}
          value={user.firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          className="input-box"
          placeholder={user.lastname}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          className="input-box"
          placeholder={user.emailid}
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
        />
        <input
          className="input-box"
          placeholder={address.street}
          value={street}
          onChange={(e) => setStreet(e.target.value)}
        />
        <div className="select-select">
          <div className="select-div">
            <CountrySelect
              onChange={(e) => {
                setCountryid(e.id);
                setCountry(e.name);
              }}
              placeHolder={address.country}
            />
            <StateSelect
              countryid={countryid}
              onChange={(e) => {
                setStateid(e);
                setState(e.name);
              }}
              placeHolder={address.state}
            />
          </div>
        </div>
        <select className="input-box" value={role} onChange={handleRoleChange}>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <button
          onClick={() => {
            handleSave().then(() => {
              alert("User Updated!");
              window.location.reload();
            });
          }}
          disabled={formChange()}
          className="save-button"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default EditUser;
