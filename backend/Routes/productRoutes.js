const productController = require("../Controllers/productController");
const express = require("express");
const router = express.Router();
const { verify, authorizeRole } = require("../middleware/auth");
const pagination = require("../Features/pagination");
const filtering = require("../Features/fitering");

router.post("/products", verify, pagination.getPaginatedProducts);
router.get("/products/range", verify, pagination.sliderProducts);
router.get("/products/:id", productController.getProductByName);
router.post(
  "/createProduct",
  verify,
  authorizeRole,
  productController.createProduct
);
router.delete(
  "/deleteProduct/:id",
  verify,
  authorizeRole,
  productController.deleteProduct
);
router.put(
  "/updateProduct/:id",
  verify,
  authorizeRole,
  productController.updateProduct
);
router.get("/product/:id", verify, productController.getProductById);
router.post("/delete/image/:id", verify, productController.deleteImage);

//Filtering routes

router.get("/filter/low", filtering.filteringByPriceASC);
router.get("/filter/high", filtering.filteringByPriceDESC);
router.get("/filter/specific", filtering.filteringByCategory);
router.get("/filter/rating/desc", filtering.filteringByRating);

module.exports = router;
