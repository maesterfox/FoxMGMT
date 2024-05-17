const cors = require("cors");

module.exports = cors({
  methods: ["GET", "POST"],
  credentials: true,
});
