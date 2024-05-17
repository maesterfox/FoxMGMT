const path = require("path");
const fs = require("fs");

module.exports = (req, res) => {
  const staticPath = path.join(__dirname, "../client/build", req.url);
  if (fs.existsSync(staticPath)) {
    return res.sendFile(staticPath);
  }

  res.sendFile(path.join(__dirname, "../client/build/index.html"));
};
