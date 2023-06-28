import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailid, setEmailId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState({});
  const [imageUrl, setImageUrl] = useState("");
  const handleSelectFile = (e) => setFile(e.target.files[0]);
  const Logout = async () => {
    try {
      await axios.get("http://localhost:3600/ecom/logoutUser");
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };
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
        setImageUrl(response.data.url);
      } else {
        alert("Please select a PNG, JPG, or JPEG file.");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formChange = () => {
    if (
      firstName === "" &&
      lastName === "" &&
      emailid === "" &&
      imageUrl === ""
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleSave = async () => {
    const res = axios
      .put(`http://localhost:3600/ecom/updateUser/${id}`, {
        firstname: firstName === "" ? user.firstname : firstName,
        lastname: lastName === "" ? user.lastname : lastName,
        emailid: emailid === "" ? user.emailid : lastName,
        imageUrl: imageUrl === "" ? user.profilepic : imageUrl,
      })
      .then(() => {
        alert("User Updated!");
        window.location.reload();
      })
      .catch(() => {
        alert("Error in updating!");
        navigate(`/products/${id}`);
      });
  };

  const getUser = async () => {
    const res = await axios.get(`http://localhost:3600/ecom/user/${id}`);
    const data = await res.data;
    return data;
  };

  useEffect(() => {
    getUser().then((data) => {
      setUser(data);
    });
  }, []);

  if (user) {
    return (
      <div className="containerr">
        <div className="profile">
          <input
            className="input-box"
            placeholder={user.firstname}
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              formChange();
            }}
          ></input>
          <input
            className="input-box"
            placeholder={user.lastname}
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              formChange();
            }}
          ></input>
          <input
            className="input-box"
            placeholder={user.emailid}
            value={emailid}
            onChange={(e) => {
              setEmailId(e.target.value);
              formChange();
            }}
          ></input>
          <div className="profile-pic-container">
            <label htmlFor="file" className="btn-grey">
              Select File
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
                  {imageUrl === "" ? "No image uploaded" : "Done!"}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              navigate(`/pass/${id}`);
            }}
            className="update-password-button"
          >
            Update Password
          </button>
          <button
            onClick={handleSave}
            disabled={formChange()}
            className="save-button"
          >
            Save
          </button>
          <button onClick={Logout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default Profile;
