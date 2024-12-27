const db = require("../config/db");



const getFlowerByCustomerNameAndTimeAndStatus = (req, res) => {
  const { first_name, last_name, start_date, end_date, status_name } = req.body;
  console.log(first_name, last_name, start_date, end_date, status_name);

  if (!first_name || !last_name || !start_date || !end_date || !status_name) {
    return res.status(400).json({
      message:
        "Ism, Familiya, Status, Boshlang'ich sana va Tugash kiritish majbur",
    });
  }

  const query = `
    SELECT flowers.* FROM flowers
    JOIN order_details on order_details.flower_id = flowers.id
    JOIN orders on orders.id = order_details.order_id
    JOIN customers on customer_id = orders.customer_id
    JOIN status on orders.status_id = status.id
    WHERE customers.first_name like ?
    AND customers.last_name LIKE ?
    AND orders.order_date BETWEEN ? AND ?
    AND status.name = ?
  `;

  db.query(
    query,
    [`%${first_name}%`, `%${last_name}%`, start_date, end_date, status_name],
    (error, result) => {
      if (error) {
        console.error("Xatolik:", error);
        return res.status(500).json({ error: "Xatolik" });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: "Bunday gul topilmadi" });
      }
      res.json(result);
    }
  );
};

module.exports = {
  getFlowerByCustomerNameAndTimeAndStatus,
};
