const db = require("../config/db");

const getOrderDetails = (req, res) => {
  db.query("SELECT * FROM order_details", (error, result) => {
    if (error) throw error;
    res.json(result);
  });
};

const getOrderDetailsById = (req, res) => {
  db.query("SELECT * FROM order_details WHERE id = ?", [req.params.id], (error, result) => {
    if (error) throw error;
    res.json(result);
  });
};

const createOrderDetails = (req, res) => {
  const { order_id, flower_id, quantity } = req.body;
  db.query("INSERT INTO order_details (order_id, flower_id, quantity) VALUES (?, ?, ?)", [order_id, flower_id, quantity], (error, result) => {
    if (error) throw error;
    res.json(result);
  });
};

const updateOrderDetails = (req, res) => {
  const { order_id, flower_id, quantity } = req.body;
  db.query("UPDATE order_details SET order_id = ?, flower_id = ?, quantity = ? WHERE id = ?", [order_id, flower_id, quantity, req.params.id], (error, result) => {
    if (error) throw error;
    res.json(result);
  });
};

const deleteOrderDetails = (req, res) => {
  db.query("DELETE FROM order_details WHERE id = ?", [req.params.id], (error, result) => {
    if (error) throw error;
    res.json(result);
  });
};

module.exports = {
  getOrderDetails,
  getOrderDetailsById,
  createOrderDetails,
  updateOrderDetails,
  deleteOrderDetails,
};
