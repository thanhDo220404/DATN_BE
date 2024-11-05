const express = require("express");
const router = express.Router();
const orderStatusController = require("../mongo/order_status.controller");

// Định nghĩa các route cho order status
router.get("/", orderStatusController.getOrderStatuses);
router.post("/", orderStatusController.addOrderStatus);
router.put("/:id", orderStatusController.updateOrderStatus);
router.delete("/:id", orderStatusController.deleteOrderStatus);

module.exports = router;
