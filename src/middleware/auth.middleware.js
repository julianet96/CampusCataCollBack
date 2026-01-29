const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  if (req.path === "/auth/login") {
    return next();
  }

  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Falta token de autenticación" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: "Falta JWT_SECRET en .env" });
  }

  try {
    const payload = jwt.verify(token, secret);
    req.auth = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

module.exports = { requireAuth };
