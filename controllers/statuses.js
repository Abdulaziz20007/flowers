const db = require("../config/db");

const getStatuses = (req, res) => {
  db.query("SELECT * FROM status", (error, result) => {
    if (error) {
      console.log("Error selecting statuses:", error);
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
    res.json(result);
  });
};

const addNewStatus = (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "name is required.",
    });
  }

  db.query(
    "INSERT INTO status (name) VALUES (?)",
    [name],
    (error, result) => {
      if (error) {
        console.error("Error adding new status:", error);
        return res.status(500).json({
          message: "Error adding new status",
          error: "Internal Server Error",
        });
      }

      res.status(201).json({
        message: "Status added successfully",
        statusId: result.insertId,
      });
    }
  );
};

const getStatusById = (req, res) => {
  const statusId = req.params.id;
  
  db.query(
    `SELECT s.*
     FROM status s
     WHERE s.id = ?`,
    [statusId],
    (error, statusResult) => {
      if (error) {
        console.error("Error retrieving status:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (statusResult.length === 0) {
        return res.status(404).json({ error: "Status not found" });
      }
      res.json(statusResult[0]);
    }
  );
};

const updateStatusById = (req, res) => {
  const statusId = req.params.id;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "name is required.",
    });
  }

  db.query(
    `UPDATE status SET name = ? WHERE id = ?`,
    [name, statusId],
    (error, result) => {
      if (error) {
        console.error("Error updating status:", error);
        return res.status(500).json({
          message: "Error updating status",
          error: "Internal Server Error",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Status not found" });
      }

      res.json({
        message: "Status updated successfully",
        statusId: statusId,
      });
    }
  );
};

const deleteStatusById = (req, res) => {
  const statusId = req.params.id;
  db.query("DELETE FROM status WHERE id = ?", [statusId], (error, result) => {
    if (error) {
      console.error("Error deleting status:", error);
      return res.status(500).json({
        message: "Error deleting status",
        error: "Internal Server Error",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Status not found" });
    }

    res.json({
      message: "Status deleted successfully",
    });
  });
};

module.exports = {
  getStatuses,
  addNewStatus,
  getStatusById,
  updateStatusById,
  deleteStatusById,
};