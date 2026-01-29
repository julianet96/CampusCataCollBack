require("dotenv").config();
const { createApp } = require("./app");
const { connectDB } = require("./config/db");

async function main() {
  const app = createApp();

  const port = process.env.PORT || 3000;
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("❌ Falta MONGODB_URI en .env");
    process.exit(1);
  }

  await connectDB(mongoUri);

  app.listen(port, () => {
    console.log(`🚀 API escuchando en http://localhost:${port}`);
  });
}

main();