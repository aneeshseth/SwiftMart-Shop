const productController = require("../Controllers/productController");
const express = require("express");
const router = express.Router();
const { verify } = require("../middleware/auth");

router.get("/products", verify, productController.getProducts);
router.get("/products/:id", productController.getProductById);
router.post("/createProduct", productController.createProduct);
router.delete("/deleteProduct", productController.deleteProduct);
router.put("/updateProduct", productController.updateProduct);

module.exports = router;
