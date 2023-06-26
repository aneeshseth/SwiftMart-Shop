import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function OrderProduct() {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState({});
  const [productDetails, setProductDetails] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [userAddress, setUserAddress] = useState({});
  const [status, setStatus] = useState();

  const { id } = useParams();

  const getOrderDetails = async () => {
    const res = await axios.get(`http://localhost:3600/ecom/order/${id}`);
    const data = await res.data;
    return data;
  };

  const getProductDetails = async (productId) => {
    const res = await axios.get(
      `http://localhost:3600/ecom/product/${productId}`
    );
    const data = await res.data;
    return data;
  };

  const getUserDetails = async (userId) => {
    const res = await axios.get(`http://localhost:3600/ecom/user/${userId}`);
    const data = await res.data;
    return data;
  };

  const getUserAddress = async (id) => {
    const res = await axios.get(`http://localhost:3600/ecom/address/${id}`);
    const data = await res.data;
    return data[0];
  };

  useEffect(() => {
    const fetchData = async () => {
      const orderData = await getOrderDetails();
      setOrderDetails(orderData);
      setStatus(orderData.status);

      const productData = await getProductDetails(orderData.product_id);
      setProductDetails(productData);

      const userData = await getUserDetails(orderData.user_id);
      setUserDetails(userData);

      const userAddressData = await getUserAddress(orderData.user_id);
      setUserAddress(userAddressData);
    };

    fetchData();
  }, [id]);

  const handleOnChange = (e) => {
    setStatus(e.target.value);
  };

  const handleDisabled = () => {
    if (status === orderDetails?.status) {
      return true;
    } else {
      return false;
    }
  };

  const handleShipping = async () => {
    const res = await axios.post(
      `http://localhost:3600/ecom/update/status/${id}`,
      {
        status: status,
      }
    );
    const data = await res.data;
    return data;
  };

  return (
    <div>
      <div>
        {productDetails.images && productDetails.images.length > 0 && (
          <img src={productDetails.images[0]} alt="Product" />
        )}
        <h2>{productDetails.name}</h2>
        <h2>Shipping Details: *ADDRESS GOES HERE!*</h2>
        <h3>Quantity: {orderDetails.quantity}</h3>
        <h3>Amount: $ {productDetails.price * orderDetails.quantity}</h3>
        <h4>STATUS: {orderDetails.status}</h4>
        <select className="input-box" value={status} onChange={handleOnChange}>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
        </select>
        <button
          disabled={handleDisabled()}
          className="save-button"
          onClick={() => {
            handleShipping().then(() => {
              window.location.reload();
              alert("Status Updated!");
            });
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default OrderProduct;
