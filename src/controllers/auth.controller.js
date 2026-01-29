const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");

const HASH_KEYLEN = 64;

function verifyPassword(password, stored) {
  if (!stored || !stored.includes(":")) return false;
  const [salt, hash] = stored.split(":");
  const derived = crypto.scryptSync(password, salt, HASH_KEYLEN).toString("hex");
  const derivedBuf = Buffer.from(derived, "hex");
  const storedBuf = Buffer.from(hash, "hex");
  if (derivedBuf.length !== storedBuf.length) return false;
  return crypto.timingSafeEqual(derivedBuf, storedBuf);
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email y password son obligatorios" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: "Falta JWT_SECRET en .env" });
    }

    const token = jwt.sign(
      { sub: user._id.toString(), email: user.email, name: user.name },
      secret,
      { expiresIn: "1h" }
    );

    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ error: "Error interno", details: err.message });
  }
}

module.exports = { login };
