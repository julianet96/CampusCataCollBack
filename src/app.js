const express = require("express");
const userRoutes = require("./routes/user.routes");

function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ ok: true, status: "up" });
  });

  app.use("/api/users", userRoutes);

  // 404
  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
}

module.exports = { createApp };