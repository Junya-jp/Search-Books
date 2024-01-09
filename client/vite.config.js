import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePluginGraphql } from 'vite-plugin-graphql';
import { ApolloClient, InMemoryCache } from '@apollo/client';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePluginGraphql({
      clientOptions: {
        uri: 'http://localhost:3001/graphql', // Update with your GraphQL server URI
        cache: new InMemoryCache(),
      },
    }),
  ],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/graphql': {
        target: 'http://localhost:3001',
        secure: false,
        changeOrigin: true,
      },
    },
  },
});
