const express = require("express");
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const crypto = require("crypto");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const connectDB = require("./config/db");

const mode = process.env.NODE_ENV || "development";

const app = express(); // Initialize the Express app

// Use helmet middleware with CSP configuration
app.use((req, res, next) => {
  // Generate a nonce for each request
  const nonce = crypto.randomBytes(16).toString("base64");

  // Use helmet to set the CSP with the nonce
  helmet.contentSecurityPolicy({
    directives: {
      "default-src": ["'self'"], // Set default-src to 'self'
      "script-src": ["'self'", `'nonce-${nonce}'`], // Allow scripts from 'self' and the current nonce
      "style-src": ["'self'", "'unsafe-inline'"], // Allow styles from 'self' and inline styles
      "img-src": ["'self'", "data:"], // Allow images from 'self' and data URIs
      "connect-src": ["'self'"], // Allow connections to 'self' (API calls, Ajax, WebSocket)
    },
    reportOnly: false, // Set to true to only report violations without blocking
  })(req, res, next); // Call helmet as middleware

  // Store the nonce in the response locals for use in the application
  res.locals.nonce = nonce;

  next(); // Continue to the next middleware
});

// Middleware
app.use(cors());

// GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: mode === "development",
  })
);

// Connect to MongoDB
connectDB()
  .then((db) => {
    // Specify the collection
    const collection = db.collection("test");

    // Now you can use the `collection` object to perform database operations
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
