const {
  getOrders,
  addNewOrder,
  getOrderById,
  updateOrderById,
  deleteOrderById,
} = require("../controllers/orders");
const {
  getOrderDetails,
  createOrderDetails,
  updateOrderDetails,
  deleteOrderDetails,
  getOrderDetailsById,
} = require("../controllers/orderDetails");

const router = require("express").Router();

router.get("/", getOrders);
router.get("/details", getOrderDetails);
router.post("/details", createOrderDetails);
router.put("/details/:id", updateOrderDetails);
router.delete("/details/:id", deleteOrderDetails);
router.get("/details/:id", getOrderDetailsById);
router.post("/", addNewOrder);
router.get("/:id", getOrderById);
router.put("/:id", updateOrderById);
router.delete("/:id", deleteOrderById);

module.exports = router;
