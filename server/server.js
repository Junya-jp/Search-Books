const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const http = require('http');
const path = require('path'); 
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const routes = require('./routes');
const cors = require('cors');

const PORT = process.env.PORT || 3001;

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  const app = express();

  // Set maxHttpHeaderSize
  app.server = http.createServer(app);
  app.server.maxHttpHeaderSize = 32768;

  // Apply CORS middleware
  app.use(cors());

  // Apply Apollo Server middleware
  server.applyMiddleware({ app });

  // Parse URL-encoded and JSON request bodies
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Serve static files (only in production)
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  // Include your routes
  app.use(routes);

  // Open the database connection
  db.once('open', () => {
    // Start the server
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`🚀 GraphQL playground at http://localhost:${PORT}/graphql`);
    });
  });
}

startApolloServer();
