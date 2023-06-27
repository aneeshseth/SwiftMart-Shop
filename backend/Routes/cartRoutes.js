const cartController = require("../Controllers/cartController");
const express = require("express");
const router = express.Router();
const { verify } = require("../middleware/auth");

router.get("/cart", verify, cartController.getCartItems);
router.post("/updateQuantity/:id", verify, cartController.updateQuanity);
router.post("/addToCart", verify, cartController.addToCart);
router.get("/deleteFromCart/:id", verify, cartController.deleteFromCart);
router.post("/getimage", cartController.getImageForCart);
router.get("/address", verify, cartController.getShippingAddress);
router.get("/cart/count", verify, cartController.getCartCount);
router.get("/cart/amt", verify, cartController.getTotalCartAmount);

module.exports = router;
