const db = require("../config/db");

const getCustomers = (req, res) => {
  db.query("SELECT * FROM customers", (error, result) => {
    if (error) {
      console.error("Error selecting customers:", error);
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
    res.json(result);
  });
};

const getCustomersByDateRange = (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({
      message: "Start date and end date are required",
    });
  }

  const query = `
    SELECT DISTINCT c.* 
    FROM customers c
    INNER JOIN orders o ON c.id = o.customer_id
    WHERE o.order_date BETWEEN ? AND ?
  `;

  db.query(query, [startDate, endDate], (error, result) => {
    if (error) {
      console.error("Error getting customers by date range:", error);
      return res.status(500).json({
        message: "Error getting customers",
        error: "Internal Server Error",
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "No customers found in this date range",
      });
    }

    res.json(result);
  });
};

const addNewCustomer = (req, res) => {
  const { first_name, last_name, phone, email, address } = req.body;

  if (!first_name || !last_name || !phone || !email || !address) {
    return res.status(400).json({
      message: "All fields are required.",
    });
  }

  db.query(
    `INSERT INTO customers (first_name, last_name, phone, email, address) VALUES (?, ?, ?, ?, ?)`,
    [first_name, last_name, phone, email, address],
    (error, result) => {
      if (error) {
        console.error("Error adding new customer:", error);
        return res.status(500).json({
          message: "Error adding new customer",
          error: "Internal Server Error",
        });
      }

      res.status(201).json({
        message: "New customer added",
        customerId: result.insertId,
      });
    }
  );
};

const getCustomerById = (req, res) => {
  const customerId = req.params.id;
  db.query(
    "SELECT * FROM customers WHERE id = ?",
    [customerId],
    (error, result) => {
      if (error) {
        console.error("Error retrieving customer:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (result.length === 0) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(result[0]);
    }
  );
};

const updateCustomerById = (req, res) => {
  const customerId = req.params.id;
  const { first_name, last_name, phone, email, address } = req.body;

  if (!first_name || !last_name || !phone || !email || !address) {
    return res.status(400).json({
      message: "All fields are required.",
    });
  }

  db.query(
    `UPDATE customers SET first_name = ?, last_name = ?, phone = ?, email = ?, address = ? WHERE id = ?`,
    [first_name, last_name, phone, email, address, customerId],
    (error, result) => {
      if (error) {
        console.error("Error updating customer:", error);
        return res.status(500).json({
          message: "Error updating customer",
          error: "Internal Server Error",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Customer not found" });
      }

      res.json({
        message: "Customer updated successfully",
        customerId: customerId,
      });
    }
  );
};

const deleteCustomerById = (req, res) => {
  const customerId = req.params.id;
  db.query(
    "DELETE FROM customers WHERE id = ?",
    [customerId],
    (error, result) => {
      if (error) {
        console.error("Error deleting customer:", error);
        return res.status(500).json({
          message: "Error deleting customer",
          error: "Internal Server Error",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Customer not found" });
      }

      res.json({
        message: "Customer deleted successfully",
      });
    }
  );
};

const findCustomerByName = (req, res) => {
  const customerName = req.params.customerName;
  db.query(
    "SELECT * FROM customers WHERE CONCAT(first_name, ' ', last_name) LIKE ?",
    [`%${customerName}%`],
    (error, result) => {
      if (error) {
        console.error("Error searching for customer:", error);
        return res.status(500).json({
          message: "Error searching for customer",
          error: "Internal Server Error",
        });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: "No customer found" });
      }
      res.json(result);
    }
  );
};

const findCustomerByQuery = (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res
      .status(400)
      .json({ message: "Name query parameter is required" });
  }

  db.query(
    "SELECT * FROM customers WHERE CONCAT(first_name, ' ', last_name) LIKE ?",
    [`%${name}%`],
    (error, result) => {
      if (error) {
        console.error("Error searching for customer:", error);
        return res.status(500).json({
          message: "Error searching for customer",
          error: "Internal Server Error",
        });
      }
      if (result.length === 0) {
        return res.status(404).json({
          message: `No customers found matching '${name}'`,
          tip: "Try searching with a different name or check the spelling",
        });
      }
      res.json(result);
    }
  );
};

const findCustomerByAny = (req, res) => {
  const { name, last_name, phone, email, address } = req.body;
  let where = "true";

  if (name) {
    where += ` and name like '%${name}%'`;
  }
  if (last_name) {
    where += ` and color like '%${color}%'`;
  }
  if (phone) {
    where += ` and color like '%${color}%'`;
  }
  if (email) {
    where += ` and color like '%${color}%'`;
  }
  if (address) {
    where += ` and color like '%${color}%'`;
  }

  console.log(where);

  if (where != "true") {
    db.query(`SELECT * FROM customers where ${where}`, (error, results) => {
      if (error) {
        console.log("Error selecting customer:", error);
        return res.status(500).json({
          error: "Internal Server Error",
        });
      }
      if (results.length == 0) {
        return res.status(404).json({
          message: "Customer not found",
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
  getCustomers,
  addNewCustomer,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
  findCustomerByName,
  findCustomerByQuery,
  findCustomerByAny,
  getCustomersByDateRange
};
