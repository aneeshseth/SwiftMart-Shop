import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./EditProducts.css";

function EditProducts() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState({});
  const [imageUrls, setImageUrls] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const getProductById = async () => {
    const res = await axios.get(`http://localhost:3600/ecom/product/${id}`);
    const data = await res.data;
    return data;
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
        setImageUrls((prevImageUrls) => [...prevImageUrls, response.data.url]);
        setUploadSuccess(true);
        alert("Upload complete!");
      } else {
        alert("Please select a PNG, JPG, or JPEG file.");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      const getProduct = await getProductById();
      await getProduct.images.map((image) =>
        setImageUrls((prevImageUrls) => [...prevImageUrls, image])
      );
      setProduct(getProduct);
    };
    fetchAll();
  }, []);

  const checkDisabled = () => {
    if (name === "" && category === "" && price === "" && !uploadSuccess) {
      return true;
    } else {
      return false;
    }
  };

  const handleSave = async () => {
    const res = await axios.put(
      `http://localhost:3600/ecom/updateProduct/${id}`,
      {
        name: name === "" ? product.name : name,
        category: category === "" ? product.category : category,
        price: price === "" ? product.price : price,
        images: imageUrls,
      }
    );
    const data = await res.data;
    return data;
  };

  const deleteImage = async (image) => {
    const res = await axios.post(
      `http://localhost:3600/ecom/delete/image/${id}`,
      {
        image: image,
      }
    );
    const data = await res.data;
    return data;
  };

  const handleSelectFile = (e) => setFile(e.target.files[0]);

  return (
    <div className="containerr">
      <div className="images-container">
        {product.images &&
          product.images.length > 0 &&
          product.images.map((image, index) => (
            <div key={index} className="image-wrapper">
              <img src={image} alt={`Product Image ${index + 1}`} />
              <button
                onClick={() => {
                  deleteImage(image).then(() => {
                    window.location.reload();
                  });
                }}
              >
                Delete
              </button>
            </div>
          ))}
      </div>
      <div className="input-container">
        <input
          className="input-box"
          value={name}
          placeholder={product.name}
          onChange={(e) => setName(e.target.value)}
        ></input>
        <input
          className="input-box"
          value={category}
          placeholder={product.category}
          onChange={(e) => setCategory(e.target.value)}
        ></input>
        <input
          className="input-box"
          value={price}
          placeholder={product.price}
          onChange={(e) => setPrice(e.target.value)}
        ></input>
        <div className="upload-container">
          <label htmlFor="file" className="btn-grey">
            Select File
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
          className="save-button"
          disabled={checkDisabled()}
          onClick={() => {
            handleSave().then(() => {
              window.location.reload();
            });
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default EditProducts;
