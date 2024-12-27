const express = require("express")
const router = express.Router();
const customersRouter = require("./customers");
const flowersRouter = require("./flowers");
const ordersRouter = require("./orders");
const statusesRouter = require("./statuses");

router.use("/customers", customersRouter);
router.use("/flowers", flowersRouter);
router.use("/orders", ordersRouter);
router.use("/statuses", statusesRouter);

module.exports = router;