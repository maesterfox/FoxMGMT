const cors = require("cors");

const allowedOrigins = [
  "https://foxmgmt-production.up.railway.app",
  "https://foxmgmt.davidfoxdev.co.uk",
];

module.exports = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
  },
  methods: ["GET", "POST"],
  credentials: true,
});
