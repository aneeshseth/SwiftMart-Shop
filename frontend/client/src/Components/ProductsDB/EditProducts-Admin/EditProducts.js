import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function EditProducts() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const getProductById = async () => {
    const res = await axios.get(`http://localhost:3600/ecom/product/${id}`);
    const data = await res.data;
    return data;
  };
  useEffect(() => {
    getProductById().then((data) => {
      setProduct(data);
    });
  }, []);
  const checkDisabled = () => {
    if (name == "" && category == "" && price == "") {
      return true;
    } else {
      return false;
    }
  };
  return (
    <div>
      {product.images &&
        product.images.length > 0 &&
        product.images.map((image) => (
          <>
            <img src={image} />
            <button>Delete Image</button>
          </>
        ))}
      <input
        value={name}
        placeholder={product.name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <input
        value={category}
        placeholder={product.category}
        onChange={(e) => setCategory(e.target.value)}
      ></input>
      <input
        value={price}
        placeholder={product.price}
        onChange={(e) => setPrice(e.target.value)}
      ></input>
      <button className="save-button" disabled={checkDisabled()}>
        Save
      </button>
      {console.log(checkDisabled())}
    </div>
  );
}

export default EditProducts;
