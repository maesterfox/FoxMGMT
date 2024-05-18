const path = require("path");
const express = require("express");
const cors = require("cors");
const graphql = require("./graphql");
const connectDB = require("./db");

const app = express();

// Connect to MongoDB
connectDB();

// Configure CORS
const allowedOrigins = [
  "http://localhost:3000", // Allow local development
  "https://foxmgmt.davidfoxdev.co.uk", // Production URL
  "https://fox-mgmt-maesterfoxs-projects.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

// Middleware to parse JSON
app.use(express.json());

app.use(express.static(path.join(__dirname, "../client/build")));

app.use("/api/graphql", graphql);

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
