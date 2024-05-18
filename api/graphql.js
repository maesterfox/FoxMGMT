const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const connectDB = require("./db");
const cors = require("cors");
const helmet = require("helmet");

module.exports = async (req, res) => {
  await connectDB();
  cors()(req, res, () => {
    helmet()(req, res, () => {
      return graphqlHTTP({
        schema,
        graphiql: process.env.NODE_ENV === "development",
      })(req, res);
    });
  });
};
