const db = require("../config/db");

const getTypes = (req, res) => {
  db.query("SELECT * FROM types", (error, result) => {
    if (error) {
      console.error("Typelarni olishda xatolik:", error);
      return res.status(500).json({ error: "Xatolik" });
    }
    res.json(result);
  });
};

const getTypeById = (req, res) => {
  const typeId = req.params.id;
  db.query("SELECT * FROM types WHERE id = ?", [typeId], (error, result) => {
    if (error) {
      console.error("Typeni olishda xatolik:", error);
      return res.status(500).json({ error: "Xatolik" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Typeni topishda xatolik" });
    }
    res.json(result[0]);
  });
};

const getTypeByName = (req, res) => {
  const { name } = req.query;
  db.query("SELECT * FROM types WHERE name LIKE ?", [`%${name}%`], (error, result) => {
    if (error) {
      console.error("Typeni olishda xatolik:", error);
      return res.status(500).json({ error: "Xatolik" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Typeni topishda xatolik" });
    }
    res.json(result);
  });
};

const createType = (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Nomi kerak" });
  }

  db.query(
    "INSERT INTO types (name, description) VALUES (?, ?)",
    [name, description],
    (error, result) => {
      if (error) {
        console.error("Typeni yaratishda xatolik:", error);
        return res.status(500).json({ error: "Xatolik" });
      }
      res.status(201).json({
        message: "Typeni yaratishda muvaffaqiyatli",
        typeId: result.insertId
      });
    }
  );
};

const updateType = (req, res) => {
  const typeId = req.params.id;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Nomi kerak" });
  }

  db.query(
    "UPDATE types SET name = ?, description = ? WHERE id = ?",
    [name, description, typeId],
    (error, result) => {
      if (error) {
        console.error("Typeni tahrirlashda xatolik:", error);
        return res.status(500).json({ error: "Xatolik" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Typeni topishda xatolik" });
      }
      res.json({ message: "Typeni tahrirlashda muvaffaqiyatli" });
    }
  );
};

const deleteType = (req, res) => {
  const typeId = req.params.id;
  
  db.query("DELETE FROM types WHERE id = ?", [typeId], (error, result) => {
    if (error) {
      console.error("Typeni o'chirishda xatolik:", error);
      return res.status(500).json({ error: "Xatolik" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Typeni topishda xatolik" });
    }
    res.json({ message: "Typeni o'chirishda muvaffaqiyatli" });
  });
};

module.exports = {
  getTypes,
  getTypeById,
  getTypeByName,
  createType,
  updateType,
  deleteType
};

