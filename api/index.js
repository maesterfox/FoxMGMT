const path = require("path");
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const connectDB = require("./db");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Manually set headers to allow all origins
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, content-type, Authorization"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// GraphQL endpoint
app.use(
  "/api/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
    customFormatErrorFn: (error) => {
      console.error("GraphQL Error:", error);
      return { message: error.message, status: error.status };
    },
  })
);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/build")));

// Catch-all to serve index.html for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
