const {
  getTypes,
  getTypeById,
  getTypeByName,
  createType,
  updateType,
  deleteType,
} = require("../controllers/flowerTypes");

const router = require("express").Router();

router.get("/", getTypes);
router.get("/:id", getTypeById);
router.get("/name/:name", getTypeByName);
router.post("/", createType);
router.put("/:id", updateType);
router.delete("/:id", deleteType);

module.exports = router;
