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

// Serve static files from the client public directory
app.use(express.static(path.join(__dirname, "../client/public")));

// Middleware to handle CSP and generate nonce
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

// CORS configuration
app.use(
  cors({
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// GraphQL endpoint configuration
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
  })
);

// MongoDB connection with retry logic
function connectWithRetry() {
  connectDB()
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => {
      console.error("MongoDB connection failed, retrying...", err);
      setTimeout(connectWithRetry, 5000);
    });
}
connectWithRetry();

// Serve the index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/public/index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).send({
    error: {
      message: err.message || "Internal Server Error",
      status: err.statusCode || 500,
    },
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
