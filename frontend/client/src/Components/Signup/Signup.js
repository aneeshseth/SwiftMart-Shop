import React, { useState, useEffect } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

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
  const [imageUrls, setImageUrls] = useState([]);
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
        setImageUrls((prevImageUrls) => [...prevImageUrls, response.data.url]);
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
        imageUrl: imageUrls[0],
      });
      const data = res.data;
      return data;
    } catch (err) {
      console.log(err);
    }
  };
  const successToast = () => {
    alert("Account created!");
  };

  const handleSubmit = async () => {
    try {
      signUp()
        .then((data) => {
          navigate(`/products/${data.id}`);
          successToast();
        })
        .catch(() => {
          alert("Invalid/Please enter all the fields correctly!");
          navigate("/");
        });
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
          src="https://media0.giphy.com/media/uGonwW6vqUTI15DKmj/giphy.gif?cid=6c09b952ccb7b2b1e773c3ed04c9cd8d14194335b49b6877&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=s"
          className="spinner"
        />
      </div>
    );
  }

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
        <input
          type="password"
          placeholder="Re enter Password"
          value={retypePass}
          onChange={(e) => setRetypePass(e.target.value)}
          required
        />
        <div className="App">
          <label htmlFor="file" className="btn-grey">
            select file
          </label>
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
                {imageUrls.length > 0 ? "Done!" : "No image uploaded"}
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
