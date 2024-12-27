const {
  getStatuses,
  addNewStatus,
  getStatusById,
  updateStatusById,
  deleteStatusById,
} = require("../controllers/statuses");

const router = require("express").Router();

router.get("/", getStatuses);
router.post("/", addNewStatus);
router.get("/:id", getStatusById);
router.put("/:id", updateStatusById);
router.delete("/:id", deleteStatusById);

module.exports = router;
