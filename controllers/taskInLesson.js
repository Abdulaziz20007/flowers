const db = require("../config/db");

const getOrderByFlowerNameAndTime = (req, res) => {
  const { name, start_date, end_date } = req.body;
  console.log(name, start_date, end_date);
  

  if (!name || !start_date || !end_date) {
    return res.status(400).json({
      message: "Nom, sana va tugash mavjud emas",
    });
  }

  const query = `
    select * from customers where id in
    (SELECT customer_id FROM orders where id in
    (select customer_id FROM order_details where flower_id in
    (SELECT id FROM flowers WHERE name LIKE ?))
    AND order_date BETWEEN ? AND ?)
  `;

  db.query(query, [`%${name}%`, start_date, end_date], (error, result) => {
    if (error) {
      console.error("Xatolik:", error);
      return res.status(500).json({ error: "Xatolik" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Bunday mijozlar topilmadi" });
    }
    res.json(result);
  });
};

module.exports = {
  getOrderByFlowerNameAndTime,
};
