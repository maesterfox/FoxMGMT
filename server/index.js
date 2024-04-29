const express = require("express");
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const connectDB = require("./config/db");

const mode = process.env.NODE_ENV || "development";

const app = express(); // Initialize the Express app

// Use helmet middleware with CSP configuration
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
    },
  })
);

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
