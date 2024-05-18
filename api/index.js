const path = require("path");
const express = require("express");
const cors = require("cors");
const graphql = require("./graphql");
const app = express();

// Configure CORS
const allowedOrigins = [
  "https://fox-mgmt-maesterfoxs-projects.vercel.app",
  "https://foxmgmt.davidfoxdev.co.uk",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, "../client/build")));

app.use("/api/graphql", graphql);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
