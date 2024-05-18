const path = require("path");
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const connectDB = require("./db");
const cors = require("./cors"); // Import the CORS configuration

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Apply the CORS middleware
app.use(cors);

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
