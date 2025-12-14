const express = require("express");
const http = require("http");
const cors = require("cors");
const setupSocket = require("./socket");

const app = express();
app.use(cors());

const server = http.createServer(app);

// socket setup
setupSocket(server);

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🔥 Backend running on http://localhost:${PORT}`);
});
