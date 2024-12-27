const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const mainRouter = require("./routers");
const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use("/api", mainRouter);
app.listen(PORT, () => {
  console.log(`Server is running at: ${PORT}`);
});
