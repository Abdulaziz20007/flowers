const db = require("../config/db");

const getFlowers = (req, res) => {
  db.query("CALL selectAllFlowers", (error, result) => {
    if (error) {
      console.error("Error getting flowers:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(result[0]);
  });
};

const addNewFlower = (req, res) => {
  const { name, color, price, flower_type, photo, import_from } = req.body;

  db.query(
    "INSERT INTO flowers (name, color, price, flower_type, photo, import_from) VALUES (?, ?, ?, ?, ?, ?)",
    [name, color, price, flower_type, photo, import_from],
    (error, result) => {
      if (error) {
        console.error("Error adding flower:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.status(201).json({
        message: "Flower added successfully",
        flowerId: result.insertId,
      });
    }
  );
};

const getFlowerById = (req, res) => {
  const flowerId = req.params.id;
  db.query(
    "SELECT * FROM flowers WHERE id = ?",
    [flowerId],
    (error, result) => {
      if (error) {
        console.log("Error selection flower by ID:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (result.length == 0) {
        return res.status(404).json({ error: "Flower not found" });
      }
      res.json(result[0]);
    }
  );
};

const updateFlowersById = (req, res) => {
  const flowerId = req.params.id;
  const { name, color, price, flower_type, photo, import_from } = req.body;

  db.query(
    `UPDATE flowers SET name = ?, color = ?, price = ?, flower_type = ?, photo = ?, import_from = ? WHERE id=?`,
    [name, color, price, flower_type, photo, import_from, flowerId],
    (error, result) => {
      if (error) {
        console.log("Error updating flower by ID:", error);
        return res.status(500).json({
          message: "Error updating new flower",
          error: "Internal Server Error",
        });
      }
      console.log(result);
      res.json({
        message: "Flower updated",
        flowerID: flowerId,
      });
    }
  );
};

const deleteFlowerById = (req, res) => {
  const flowerId = req.params.id;

  db.query("DELETE FROM flowers WHERE id = ?", [flowerId], (error, result) => {
    if (error) {
      console.error("Error deleting flower:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Flower not found" });
    }
    res.json({ message: "Flower deleted successfully" });
  });
};

const findFlowerByName = (req, res) => {
  const flowerName = req.params.flowerName;

  db.query(
    "SELECT * FROM flowers WHERE name LIKE ?",
    [`%${flowerName}%`],
    (error, result) => {
      if (error) {
        console.error("Error searching flower:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: "No flowers found" });
      }
      res.json(result);
    }
  );
};

const findFlowerByNameQuery = (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res
      .status(400)
      .json({ message: "Name query parameter is required" });
  }

  db.query(
    "SELECT * FROM flowers WHERE name LIKE ?",
    [`%${name}%`],
    (error, result) => {
      if (error) {
        console.error("Error searching flower:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: "No flowers found" });
      }
      res.json(result);
    }
  );
};

const findFlowerByAny = (req, res) => {
  const { name, color, start_price, finish_price } = req.body;
  let where = "true";

  if (name) {
    where += ` and like '%${name}%'`;
  }
  if (color) {
    where += ` and color like '%${color}%'`;
  }

  if (start_price && finish_price) {
    where += ` and price BETWEEN ${start_price} and ${finish_price}`;
  } else if (start_price) {
    where += ` and price = ${start_price}`;
  }

  console.log(where);

  if (where != "true") {
    db.query(`SELECT * FROM flowers where ${where}`, (error, results) => {
      if (error) {
        console.log("Error selecting flower:", error);
        return res.status(500).json({
          error: "Internal Server Error",
        });
      }
      if (results.length == 0) {
        return res.status(404).json({
          message: "Flower not found",
        });
      }
      res.json(results);
    });
  } else {
    return res.status(400).json({
      message: "Qidirish parametrini kiriting",
    });
  }
};

module.exports = {
  getFlowers,
  addNewFlower,
  getFlowerById,
  updateFlowersById,
  deleteFlowerById,
  findFlowerByName,
  findFlowerByNameQuery,
  findFlowerByAny,
};
