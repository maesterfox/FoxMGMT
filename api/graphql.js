const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const connectDB = require("./db");
const helmet = require("helmet");

module.exports = async (req, res) => {
  try {
    await connectDB();
    helmet()(req, res, () => {
      return graphqlHTTP({
        schema,
        graphiql: process.env.NODE_ENV === "development",
        customFormatErrorFn: (error) => {
          console.error("GraphQL Error:", error);
          return { message: error.message, status: error.status };
        },
      })(req, res);
    });
  } catch (error) {
    console.error("Error in GraphQL middleware:", error);
    res.status(500).send("Internal Server Error");
  }
};
