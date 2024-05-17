module.exports = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).send({
    error: {
      message: err.message || "Internal Server Error",
      status: err.statusCode || 500,
    },
  });
};
