const { User } =require ('../models');
const {signToken} = require ('../utils/auth');
const {AuthenticationError} =require('apollo-server-express')



const resolvers = {
    Query: {
        async getSingleUser(_,{id}){
            return await User.findById(id).populate('savedBooks')
        }
        },
    
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return {token, user};
        },
 
        login: async (parent, {email, password}) => {
            const user = await User.findOne({email})
            if(!user) {
                throw  new AuthenticationError('Invalid Credential');
            }
            const correctPw = await user.isCorrectPassword(password)
            if(!correctPw) {
                throw new AuthenticationError('Incorrect credentials')
            }
            const token = signToken(user);
            return {token, user};
        },
        saveBook: async (_, { userId, bookData }) => {
  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    { $addToSet: { savedBooks: bookData } },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    throw new AuthenticationError('User not found');
  }

  return {
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    savedBooks: updatedUser.savedBooks,
  };
},

      
        removeBook: async (_, {userId, bookId} ) => {
            return await User.findByIdAndUpdate(
                {_id:userId},
                {$pull:{savedBooks:{bookId}}},
                {new:true}
            );
        }
    },
};
module.exports = resolvers;