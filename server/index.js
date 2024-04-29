const express = require("express");
const helmet = require("helmet");
const crypto = require("crypto");
const { graphqlHTTP } = require("express-graphql");
const path = require("path");
const fs = require("fs");
const schema = require("./schema/schema");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  const nonce = crypto.randomBytes(16).toString("base64");
  res.locals.nonce = nonce;
  helmet.contentSecurityPolicy({
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'", `'nonce-${nonce}'`, "https://cdn.jsdelivr.net"],
      "style-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      "img-src": ["'self'", "data:"],
      "connect-src": ["'self'"],
    },
  })(req, res, next);
});

app.use(
  cors({
    origin: ["https://foxmgmt.onrender.com"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
  })
);

function connectWithRetry() {
  connectDB()
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => {
      console.error("MongoDB connection failed, retrying...", err);
      setTimeout(connectWithRetry, 5000);
    });
}
connectWithRetry();

app.get("/", (req, res) => {
  let filePath = path.join(__dirname, "public", "index.html");
  console.log("Trying to read file from:", filePath);
  fs.readFile(filePath, "utf8", (err, html) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Error loading the page");
    }
    html = html.replace("%CSP_NONCE%", res.locals.nonce);
    res.send(html);
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).send({
    error: {
      message: err.message || "Internal Server Error",
      status: err.statusCode || 500,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
