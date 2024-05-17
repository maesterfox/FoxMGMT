const { graphqlHTTP } = require("express-graphql");
const schema = require("../schema/schema");
const connectDB = require("./db");
const cors = require("./cors");
const csp = require("./csp");

module.exports = async (req, res) => {
  await connectDB();
  cors(req, res, () => {
    csp(req, res, () => {
      return graphqlHTTP({
        schema,
        graphiql: process.env.NODE_ENV === "development",
      })(req, res);
    });
  });
};
