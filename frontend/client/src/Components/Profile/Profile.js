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
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState({});
  const [imageUrls, setImageUrls] = useState([]);
  const handleSelectFile = (e) => setFile(e.target.files[0]);
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

  const handleSave = async () => {
    const res = axios
      .put(`http://localhost:3600/ecom/updateUser/${id}`, {
        firstname: firstName === "" ? user.firstname : firstName,
        lastname: lastName === "" ? user.lastname : lastName,
        emailid: emailid === "" ? user.emailid : lastName,
        imageUrl: imageUrls[0] === [] ? imageUrls[0] : user.profilepic,
      })
      .then(() => {
        navigate(`/products/${id}`);
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
      <>
        <input
          className="input-box"
          placeholder={user.firstname}
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
            setIsFormChanged(true);
          }}
        ></input>
        <input
          className="input-box"
          placeholder={user.lastname}
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
            setIsFormChanged(true);
          }}
        ></input>
        <input
          className="input-box"
          placeholder={user.emailid}
          value={emailid}
          onChange={(e) => {
            setEmailId(e.target.value);
            setIsFormChanged(true);
          }}
        ></input>
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
        <button
          onClick={() => {
            navigate(`/pass/${id}`);
          }}
        >
          Update password
        </button>
        <button onClick={handleSave} disabled={!isFormChanged}>
          Save
        </button>
      </>
    );
  }

  return null;
}

export default Profile;
