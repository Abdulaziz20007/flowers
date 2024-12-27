const db = require("../config/db");

const getOrders = (req, res) => {
  db.query("SELECT * FROM orders", (error, result) => {
    if (error) {
      console.log("Eror selecting orders:", error);
      return res.status(500).json({
        error: "Internal Serveer Error",
      });
    }
    res.json(result);
  });
};


const addNewOrder = (req, res) => {
  const { customer_id, total_price, order_details } = req.body;

  if (!customer_id || !total_price || !order_details || !Array.isArray(order_details)) {
    return res.status(400).json({
      message: "All fields are required and order_details must be an array.",
    });
  }

  db.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction:", err);
      return res.status(500).json({
        message: "Error creating order",
        error: "Internal Server Error",
      });
    }

    db.query(
      `INSERT INTO orders (customer_id, total_price, order_date, status_id) VALUES (?, ?, NOW(), 1)`,
      [customer_id, total_price],
      (error, result) => {
        if (error) {
          return db.rollback(() => {
            console.error("Error adding new order:", error);
            res.status(500).json({
              message: "Error adding new order",
              error: "Internal Server Error",
            });
          });
        }

        const orderId = result.insertId;

        const orderDetailsValues = order_details.map(detail => 
          [orderId, detail.flower_id, detail.quantity]
        );

        db.query(
          `INSERT INTO order_details (order_id, flower_id, quantity) VALUES ?`,
          [orderDetailsValues],
          (error, detailResult) => {
            if (error) {
              return db.rollback(() => {
                console.error("Error adding order details:", error);
                res.status(500).json({
                  message: "Error adding order details",
                  error: "Internal Server Error",
                });
              });
            }

            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  console.error("Error committing transaction:", err);
                  res.status(500).json({
                    message: "Error creating order",
                    error: "Internal Server Error",
                  });
                });
              }

              res.status(201).json({
                message: "New order added",
                orderId: orderId,
              });
            });
          }
        );
      }
    );
  });
};

const getOrderById = (req, res) => {
  const orderId = req.params.id;

  db.query(
    `SELECT o.*, 
            c.first_name, c.last_name, c.email, c.phone,
            s.name as status_name
     FROM orders o
     LEFT JOIN customers c ON o.customer_id = c.id
     LEFT JOIN status s ON o.status_id = s.id
     WHERE o.id = ?`,
    [orderId],
    (error, orderResult) => {
      if (error) {
        console.error("Error retrieving order:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (orderResult.length === 0) {
        return res.status(404).json({ error: "Order not found" });
      }

      db.query(
        `SELECT od.*, f.name as flower_name, f.price as unit_price
         FROM order_details od
         LEFT JOIN flowers f ON od.flower_id = f.id
         WHERE od.order_id = ?`,
        [orderId],
        (error, detailsResult) => {
          if (error) {
            console.error("Error retrieving order details:", error);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          const order = orderResult[0];
          order.order_details = detailsResult;

          res.json(order);
        }
      );
    }
  );
};

const updateOrderById = (req, res) => {
  const orderId = req.params.id;
  const { customer_id, total_price, status_id, order_details } = req.body;

  if (!customer_id || !total_price || !status_id) {
    return res.status(400).json({
      message: "customer_id, total_price, and status_id are required.",
    });
  }

  db.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction:", err);
      return res.status(500).json({
        message: "Error updating order",
        error: "Internal Server Error",
      });
    }

    db.query(
      `UPDATE orders SET customer_id = ?, total_price = ?, status_id = ? WHERE id = ?`,
      [customer_id, total_price, status_id, orderId],
      (error, result) => {
        if (error) {
          return db.rollback(() => {
            console.error("Error updating order:", error);
            res.status(500).json({
              message: "Error updating order",
              error: "Internal Server Error",
            });
          });
        }

        if (result.affectedRows === 0) {
          return db.rollback(() => {
            res.status(404).json({ message: "Order not found" });
          });
        }

        if (order_details && Array.isArray(order_details)) {
          db.query(
            "DELETE FROM order_details WHERE order_id = ?",
            [orderId],
            (error) => {
              if (error) {
                return db.rollback(() => {
                  console.error("Error deleting old order details:", error);
                  res.status(500).json({
                    message: "Error updating order details",
                    error: "Internal Server Error",
                  });
                });
              }

              const orderDetailsValues = order_details.map(detail => 
                [orderId, detail.flower_id, detail.quantity]
              );

              db.query(
                `INSERT INTO order_details (order_id, flower_id, quantity) VALUES ?`,
                [orderDetailsValues],
                (error) => {
                  if (error) {
                    return db.rollback(() => {
                      console.error("Error adding new order details:", error);
                      res.status(500).json({
                        message: "Error updating order details",
                        error: "Internal Server Error",
                      });
                    });
                  }

                  db.commit((err) => {
                    if (err) {
                      return db.rollback(() => {
                        console.error("Error committing transaction:", err);
                        res.status(500).json({
                          message: "Error updating order",
                          error: "Internal Server Error",
                        });
                      });
                    }

                    res.json({
                      message: "Order updated successfully",
                      orderId: orderId,
                    });
                  });
                }
              );
            }
          );
        } else {
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                console.error("Error committing transaction:", err);
                res.status(500).json({
                  message: "Error updating order",
                  error: "Internal Server Error",
                });
              });
            }

            res.json({
              message: "Order updated successfully",
              orderId: orderId,
            });
          });
        }
      }
    );
  });
};

const deleteOrderById = (req, res) => {
  const orderId = req.params.id;
  db.query("DELETE FROM orders WHERE id = ?", [orderId], (error, result) => {
    if (error) {
      console.error("Error deleting order:", error);
      return res.status(500).json({
        message: "Error deleting order",
        error: "Internal Server Error",
      });
    }

    res.json({
      message: "Order deleted successfully",
    });
  });
};

getOrderDetailsById = (req, res) => {
  db.query("SELECT * FROM order_detils")
}


module.exports = {
  getOrders,
  addNewOrder,
  getOrderById,
  updateOrderById,
  deleteOrderById,
};
