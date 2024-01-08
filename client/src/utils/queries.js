import {gql} from '@apollo/client';

export const GET_ME = gql`
query getMe($id:ID!){
    getSingleUser(id:$id){
        _id
        username
        email
        savedBooks {
            bookId
            authors
            description
            title
            image
            link
        }
    }
}
`;