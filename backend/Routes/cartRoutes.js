const cartController = require("../Controllers/cartController");
const express = require("express");
const router = express.Router();
const { verify } = require("../middleware/auth");

router.get("/cart", verify, cartController.getCartItems);
router.post("/addToCart", verify, cartController.addToCart);
router.post("/DeleteFromCart", verify, cartController.deleteFromCart);

module.exports = router;
