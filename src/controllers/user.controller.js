const crypto = require("crypto");
const { User } = require("../models/user.model");

const HASH_KEYLEN = 64;
const HASH_SALT_BYTES = 16;

function hashPassword(password) {
  const salt = crypto.randomBytes(HASH_SALT_BYTES).toString("hex");
  const derived = crypto.scryptSync(password, salt, HASH_KEYLEN).toString("hex");
  return `${salt}:${derived}`;
}

function sanitizeUser(user) {
  const data = user.toObject();
  delete data.password;
  return data;
}

async function createUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email y password son obligatorios" });
    }

    const created = await User.create({ name, email, password: hashPassword(password) });
    return res.status(201).json(sanitizeUser(created));
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

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    if (!name && !email && !password) {
      return res.status(400).json({ error: "Debe enviar al menos un campo para actualizar" });
    }

    const update = {};
    if (name) update.name = name;
    if (email) update.email = email;
    if (password) update.password = hashPassword(password);

    const updated = await User.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    return res.json(sanitizeUser(updated));
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Email ya existe" });
    }
    return res.status(500).json({ error: "Error interno", details: err.message });
  }
}

module.exports = { createUser, listUsers, updateUser };
