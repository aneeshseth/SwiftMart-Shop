import React, { useState } from "react";
import axios from "axios";
import "./Add.css";

function Add() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [ISBN, setISBN] = useState("");
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
        alert("Image Uploaded!");
      } else {
        alert("Please select a PNG, JPG, or JPEG file.");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (imageUrls.length !== 0) {
      const res = await axios.post("http://localhost:3600/ecom/createProduct", {
        name: name,
        category: category,
        price: price,
        isbn: ISBN,
        images: imageUrls,
      });
      const data = await res.data;
      return data;
    } else {
      alert("Complete All fields!");
    }
  };

  return (
    <div className="containerr">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
      />
      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
      />
      <input
        value={ISBN}
        onChange={(e) => setISBN(e.target.value)}
        placeholder="ISBN"
      />
      <div className="upload-container">
        <label htmlFor="file" className="btn-grey">
          Select
        </label>
        {file && <center>{file.name}</center>}
        <input
          id="file"
          type="file"
          required
          onChange={handleSelectFile}
          multiple={false}
        />
        {file && (
          <div className="button-container">
            <button onClick={handleUpload} className="btn-green">
              {loading ? "Uploading" : "Upload"}
            </button>
          </div>
        )}
      </div>
      <button
        onClick={() => {
          handleSubmit().then((data) => {
            if (data === "ISBN not unique!") {
              alert(data);
            } else if (data === "Product added!") {
              alert("Product Added!");
              window.location.reload();
            }
          });
        }}
      >
        Add Product
      </button>
    </div>
  );
}

export default Add;
