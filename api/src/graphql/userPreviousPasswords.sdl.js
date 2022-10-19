export const schema = gql`
  type UserPreviousPassword {
    id: Int!
    userId: Int!
    User: User!
    hashedPassword: String!
    salt: String!
  }

  type Query {
    userPreviousPasswords: [UserPreviousPassword!]! @requireAuth
    userPreviousPassword(id: Int!): UserPreviousPassword @requireAuth
  }

  input CreateUserPreviousPasswordInput {
    userId: Int!
    hashedPassword: String!
    salt: String!
  }

  input UpdateUserPreviousPasswordInput {
    userId: Int
    hashedPassword: String
    salt: String
  }

  type Mutation {
    createUserPreviousPassword(
      input: CreateUserPreviousPasswordInput!
    ): UserPreviousPassword! @requireAuth
    updateUserPreviousPassword(
      id: Int!
      input: UpdateUserPreviousPasswordInput!
    ): UserPreviousPassword! @requireAuth
    deleteUserPreviousPassword(id: Int!): UserPreviousPassword! @requireAuth
  }
`
