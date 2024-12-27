const {
  getCustomers,
  addNewCustomer,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
  findCustomerByName,
  findCustomerByQuery,
  findCustomerByAny,
  getCustomersByDateRange,
} = require("../controllers/customers");
const { getOrderByFlowerNameAndTime } = require("../controllers/taskInLesson");

const router = require("express").Router();

router.get("/getOrdersByFlowerNameAndTime", getOrderByFlowerNameAndTime);
router.get("/findquery", findCustomerByQuery);
router.get("/findany", findCustomerByAny);
router.get("/find/:customerName", findCustomerByName);
router.get("/", getCustomers);
router.post("/", addNewCustomer);
router.get("/:id", getCustomerById);
router.put("/:id", updateCustomerById);
router.delete("/:id", deleteCustomerById);
router.get("/date-range", getCustomersByDateRange);
module.exports = router;
