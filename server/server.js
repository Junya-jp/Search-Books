const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const { typeDefs } = require('./typeDefs');
const { resolvers } = require('./resolvers');
const { verifyToken } = require('./utils/auth');
const { User } = require('./models');

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    // Get the token from the request headers
    const token = req.headers.authorization || '';

    // Verify the token and get user information
    const user = await verifyToken(token);

    return { user };
  },
});

server.applyMiddleware({ app });

const PORT = process.env.PORT || 3001;

mongoose.connect('mongodb://localhost:27017/googlebooks', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
