require("dotenv").config();

const app = require("./app");
const db = require("./config/database");
require("./services/event.listeners");

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await db.authenticate();
    console.log("Database connection established");

    app.listen(port, () => {
      const baseUrl = process.env.APP_URL || `http://localhost:${port}`;
      console.log(`Server running at ${baseUrl}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();
