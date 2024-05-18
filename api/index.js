const path = require("path");
const express = require("express");
const graphql = require("./graphql");
const app = express();

app.use(express.static(path.join(__dirname, "../client/build")));

app.use("/graphql", graphql);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
