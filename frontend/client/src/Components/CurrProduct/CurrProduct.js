import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CurrProduct.css";
import { useNavigate } from "react-router-dom";

function CurrProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const getProductByName = async () => {
    const res = await axios.get(`http://localhost:3600/ecom/products/${id}`);
    const data = await res.data;
    return data;
  };
  const addToCart = async (id) => {
    const res = await axios.post("http://localhost:3600/ecom/addToCart", {
      product_id: id,
    });
    const data = await res.data;
    console.log(data);
    return data;
  };
  useEffect(() => {
    getProductByName().then((data) => {
      setProduct(data[0]);
    });
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [id]);

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
    <div className="product-page">
      <div className="product-page__carousel">
        {product.images.map((image, index) => (
          <div key={index} className={`slider ${index === 0 ? "active" : ""}`}>
            <img src={image} alt={`Product ${index + 1}`} className="image" />
          </div>
        ))}
      </div>
      <div className="product-page__details">
        <h1 className="product-page__name">{product.name}</h1>
        <p className="product-page__category">{product.category}</p>
        <p className="product-page__price">${product.price}</p>
        <p className="product-page__isbn">ISBN: {product.isbn}</p>
        <button
          onClick={() => {
            addToCart(product.id)
              .then(() => {
                navigate("/cart");
              })
              .catch(() => {
                alert("Couldnt add to cart!");
                navigate("/products");
              });
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default CurrProduct;
