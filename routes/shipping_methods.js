const express = require("express");
const router = express.Router();
const shippingMethodController = require("../mongo/shipping_method.controller");

// Định nghĩa các route cho shipping methods
router.get("/", shippingMethodController.getShippingMethods);
router.post("/", shippingMethodController.addShippingMethod);
router.put("/:id", shippingMethodController.updateShippingMethod);
router.delete("/:id", shippingMethodController.deleteShippingMethod);

module.exports = router;
