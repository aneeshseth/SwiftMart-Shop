const productController = require("../Controllers/productController");
const express = require("express");
const router = express.Router();
const { verify, authorizeRole } = require("../middleware/auth");
const pagination = require("../Features/pagination");
const filtering = require("../Features/fitering");

router.get("/products", verify, pagination.getPaginatedProducts);
router.get("/products/:id", productController.getProductById);
router.post("/createProduct", productController.createProduct);
router.delete("/deleteProduct/:id", productController.deleteProduct);
router.put("/updateProduct/:id", productController.updateProduct);

//Filtering routes

router.get("/filter/a-z/ASC", filtering.filteringByAlphabetASC);
router.get("/filter/z-a/DESC", filtering.filteringByAlphabetDESC);
router.get("/filter/low", filtering.filteringByPriceASC);
router.get("/filter/high", filtering.filteringByPriceDESC);
router.get("/filter/price", filtering.filteringBySpecificPrice);
router.get("/filter/rating/ASC", filtering.filteringByRatingASC);
router.get("/filter/rating/DESC", filtering.filteringByRatingDESC);
router.get("/filter/specific", filtering.filteringByCategory);

module.exports = router;
