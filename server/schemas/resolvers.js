const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
  Query: {
    async getSingleUser(_, { id }, context) {
      // Access the user information from context
      const { user } = context;
      if (!user) {
        throw new AuthenticationError('Authentication required');
      }

      return await User.findById(id).populate('savedBooks');
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (_, { bookData }, context) => {
      const { user } = context;
      if (!user) {
        throw new AuthenticationError('Authentication required');
      }

      return await User.findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { savedBooks: bookData } },
        { new: true, runValidators: true }
      );
    },

    removeBook: async (_, { bookId }, context) => {
      const { user } = context;
      if (!user) {
        throw new AuthenticationError('Authentication required');
      }

      return await User.findByIdAndUpdate(
        { _id: user._id },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
    },
  },
};

module.exports = resolvers;
