const ratingController = require("../Controllers/ratingController");
const express = require("express");
const router = express.Router();
const { verify } = require("../middleware/auth");

router.route("/addrating/:id").post(verify, ratingController.addReview);
router.route("/ratings/:id").get(verify, ratingController.getReviews);
router
  .route("/averageRating/:id")
  .get(verify, ratingController.getAverageRating);
module.exports = router;
