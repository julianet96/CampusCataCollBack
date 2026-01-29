const { User } = require("../models/user.model");

async function createUser(req, res) {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "name y email son obligatorios" });
    }

    const created = await User.create({ name, email });
    return res.status(201).json(created);
  } catch (err) {
    // Duplicado (email unique)
    if (err.code === 11000) {
      return res.status(409).json({ error: "Email ya existe" });
    }
    return res.status(500).json({ error: "Error interno", details: err.message });
  }
}

async function listUsers(req, res) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ error: "Error interno", details: err.message });
  }
}

module.exports = { createUser, listUsers };