const express = require("express");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const { requireAuth } = require("./middleware/auth.middleware");

function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ ok: true, status: "up" });
  });

  app.use("/api", requireAuth);
  app.use("/api/users", userRoutes);
  app.use("/api/auth", authRoutes);

  // 404
  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
}

module.exports = { createApp };
