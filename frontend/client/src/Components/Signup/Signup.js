import React, { useState, useEffect } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CountrySelect, StateSelect } from "react-country-state-city";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailid, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [retypePass, setRetypePass] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState({});
  const [imageUrls, setImageUrls] = useState("");
  const [countryid, setCountryid] = useState(0);
  const [stateid, setstateid] = useState(0);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [street, setStreet] = useState("");
  const handleSelectFile = (e) => setFile(e.target.files[0]);

  const navigate = useNavigate();

  const handleUpload = async () => {
    try {
      setLoading(true);
      const data = new FormData();
      const allowedFormats = ["png", "jpg", "jpeg"];
      const fileType = file.name.split(".").pop().toLowerCase();
      data.append("my_file", file);
      if (allowedFormats.includes(fileType)) {
        const response = await axios.post("http://localhost:3600/upload", data);
        setRes(response.data);
        console.log(response.data);
        setImageUrls(response.data.url);
        console.log(imageUrls);
      } else {
        alert("Please select a PNG, JPG, or JPEG file.");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    try {
      const res = await axios.post("http://localhost:3600/ecom/createUser", {
        firstname: firstName,
        lastname: lastName,
        emailid: emailid,
        password: password,
        retypePass: retypePass,
        imageUrl: imageUrls,
        country: country,
        state: state,
        street: street,
      });
      const data = res.data;
      return data;
    } catch (err) {}
  };
  const successToast = () => {
    alert("Account created!");
  };

  const handleSubmit = async () => {
    try {
      if (
        firstName === "" ||
        lastName === "" ||
        emailid === "" ||
        password === "" ||
        retypePass === "" ||
        country === "" ||
        state === "" ||
        street === ""
      ) {
        alert("Please Enter All Values!");
      } else {
        signUp()
          .then((data) => {
            navigate(`/products/${data.id}`);
            successToast();
          })
          .catch(() => {
            alert("Invalid/Please enter all the fields correctly!");
            navigate("/");
          });
      }
    } catch (error) {
      navigate("/");
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
          alt=""
        />
      </div>
    );
  }

  return (
    <div className="signup-container">
      <a
        href="https://github.com/aneeshseth/Swift-Mart"
        className="logo-container"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
          alt="Example Logo"
          className="logo-image"
        />
      </a>
      <div className="signup-form">
        <h2 className="signup-heading">Sign up</h2>
        <div className="credentials">Login Page has access credentials!</div>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="email"
          name="email"
          placeholder="Email ID"
          value={emailid}
          onChange={(e) => setEmailId(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Re enter Password"
          value={retypePass}
          onChange={(e) => setRetypePass(e.target.value)}
        />
        <div className="select-select">
          <div className="select-div">
            <CountrySelect
              onChange={(e) => {
                setCountryid(e.id);
                setCountry(e.name);
              }}
              placeHolder="Select Country"
            />
            <StateSelect
              countryid={countryid}
              onChange={(e) => {
                setstateid(e);
                setState(e.name);
              }}
              placeHolder="Select State"
            />
          </div>
        </div>
        <input
          placeholder="Street Address"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
        />
        <div className="App">
          <h5>Select Profile Picture below:</h5>
          {file && <center>{file.name}</center>}
          <input
            id="file"
            type="file"
            onChange={handleSelectFile}
            multiple={false}
          />
          {file && (
            <div className="button-container">
              <button onClick={handleUpload} className="btn-green">
                {loading ? "Uploading" : "Set Profile Picture"}
              </button>
              <div className="done">
                {imageUrls === "" ? "No image uploaded" : "Done!"}
              </div>
            </div>
          )}
        </div>
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
