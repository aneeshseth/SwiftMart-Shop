const productController = require("../Controllers/productController");
const express = require("express");
const router = express.Router();
const { verify, authorizeRole } = require("../middleware/auth");
const pagination = require("../Features/pagination");
const filtering = require("../Features/fitering");

router.get("/products", verify, pagination.getPaginatedProducts);
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

//Filtering routes

router.get("/filter/low", filtering.filteringByPriceASC);
router.get("/filter/high", filtering.filteringByPriceDESC);
router.get("/filter/rating/ASC", filtering.filteringByRatingASC);
router.get("/filter/rating/DESC", filtering.filteringByRatingDESC);
router.get("/filter/specific", filtering.filteringByCategory);

module.exports = router;
