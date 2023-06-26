const orderController = require("../Controllers/OrderController");
const express = require("express");
const router = express.Router();
const { verify } = require("../middleware/auth");

router.route("/orderCreate/:id").get(orderController.createOrder);
router.route("/orders/:id").get(orderController.getOrders);
router.route("/cancel/:id").get(orderController.cancelOrder);
router.route("/order/total").get(orderController.totalOrderRevenue);
router.route("/orders").get(orderController.getAllOrders);
router.route("/order/:id").get(orderController.getOrder);
router.route("/update/status/:id").post(orderController.updateStatus);

module.exports = router;
