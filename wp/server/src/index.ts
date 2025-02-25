// core imports
import http from "http";
import { config } from "dotenv";

config();

// custom imports
import app from "./app";
import connectDB from "./lib/connect-db";

const server = http.createServer(app);
const PORT = process.env.PORT || 4444;

server.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});
