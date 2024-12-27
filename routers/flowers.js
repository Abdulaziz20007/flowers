const express = require("express");

const {
  getFlowers,
  addNewFlower,
  getFlowerById,
  updateFlowersById,
  deleteFlowerById,
  findFlowerByName,
  findFlowerByNameQuery,
  findFlowerByAny,
} = require("../controllers/flowers");
const {
  getFlowerByCustomerNameAndTimeAndStatus,
} = require("../controllers/taskInLesson2");

const router = express.Router();

router.get(
  "/getFlowerByCustomerNameAndTimeAndStatus",
  getFlowerByCustomerNameAndTimeAndStatus
);
router.get("/findquery", findFlowerByNameQuery);
router.get("/findany", findFlowerByAny);
router.get("/find/:flowerName", findFlowerByName);
router.get("/", getFlowers);
router.post("/", addNewFlower);
router.get("/:id", getFlowerById);
router.put("/:id", updateFlowersById);
router.delete("/:id", deleteFlowerById);

module.exports = router;
