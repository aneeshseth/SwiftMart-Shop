import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CurrProduct.css";
import { useNavigate } from "react-router-dom";
import Modal from "react-overlays/Modal";
import { Rating } from "@mui/material";

function CurrProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState("");
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

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
    return data;
  };

  const handleSuccess = async () => {
    if (!isNaN(rating) && review !== "" && rating <= 5) {
      const res = await axios.post(
        `http://localhost:3600/ecom/addrating/${id}`,
        {
          review: review,
          rating: rating,
          name: name,
        }
      );
      const data = await res.data;
      setRating("");
      setReview("");
      setName("");
      handleClose();
      window.location.reload();
    } else {
      alert("Invalid input!");
      handleClose();
    }
  };

  const renderBackdrop = (props) => <div className="backdrop" {...props} />;

  const handleClose = () => {
    setRating("");
    setReview("");
    setName("");
    setShowModal(false);
  };

  const getReviews = async () => {
    const res = await axios.get(`http://localhost:3600/ecom/ratings/${id}`);
    const data = await res.data;
    setReviews(data);
  };

  useEffect(() => {
    getProductByName().then((data) => {
      setProduct(data[0]);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    });
  }, [id]);

  useEffect(() => {
    getReviews();
  }, [review]);

  useEffect(() => {
    getReviews();
  }, []);

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3600/ecom/averageRating/${id}`
        );
        const avgRating = res.data;
        setAverageRating(parseInt(avgRating));
      } catch (error) {
        console.error("Error fetching average rating:", error);
      }
    };

    fetchAverageRating();
  }, [id, review]);

  if (isLoading) {
    return (
      <div className="spinner-container">
        <img
          src="https://smhfoundation.ca/wp-content/plugins/interactive-3d-flipbook-powered-physics-engine/assets/images/dark-loader.gif"
          className="spinner"
          alt="Loading spinner"
        />
      </div>
    );
  }

  return (
    <div className="product-pagee">
      <div className="product-page__carousel">
        {product.images.map((image, index) => (
          <div
            key={index}
            className={`slider ${index === 0 ? "active" : ""}`}
            style={{
              minWidth: "300px",
              maxWidth: "800px",
              marginRight: "10px",
            }}
          >
            <img
              src={image}
              alt={`Product ${index + 1}`}
              className="image"
              style={{ width: "100%", height: "auto", borderRadius: "10px" }}
            />
          </div>
        ))}
      </div>
      <div className="product-page__details">
        <h1 className="product-page__name">{product.name}</h1>
        <Rating name="half-rating" defaultValue={averageRating} readOnly />
        <p className="product-page__category">{product.category}</p>
        <p className="product-page__price">${product.price}</p>
        <p className="product-page__isbn">ISBN: {product.isbn}</p>
        <button
          className="add-cart"
          onClick={() => {
            addToCart(product.id)
              .then(() => {
                navigate("/cart");
              })
              .catch(() => {
                alert("Couldn't add to cart!");
                navigate("/products");
              });
          }}
        >
          Add to Cart
        </button>
        <Modal
          className="modal"
          show={showModal}
          onHide={handleClose}
          renderBackdrop={renderBackdrop}
        >
          <div>
            <div className="modal-header">
              <div className="modal-title">Review</div>
              <div>
                <span className="close-button" onClick={handleClose}>
                  x
                </span>
              </div>
            </div>
            <div className="modal-desc">
              <input
                type="text"
                placeholder="Name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Review"
                value={review}
                required
                onChange={(e) => setReview(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter a Rating out of 5"
                value={rating}
                required
                onChange={(e) => setRating(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button className="secondary-button" onClick={handleClose}>
                Close
              </button>
              <button className="primary-button" onClick={handleSuccess}>
                Success
              </button>
            </div>
          </div>
        </Modal>
        <div>
          <button
            type="button"
            className="enter-review"
            onClick={() => setShowModal(true)}
          >
            Enter Review
          </button>
        </div>
        <div id="reviewContainer">
          <h1>Reviews:</h1>
          {reviews.length === 0 ? (
            <div style={{ color: "black" }}>No reviews!</div>
          ) : (
            reviews.map((review, index) => (
              <div key={index} style={{ color: "black" }}>
                <h4>{review.name}</h4>
                <div>{review.review}</div>
                <Rating
                  name="half-rating"
                  defaultValue={review.rating}
                  readOnly
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CurrProduct;
