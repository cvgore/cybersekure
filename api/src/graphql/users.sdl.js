export const schema = gql`
  type User {
    id: Int!
    username: String!
    roles: String!
    hashedPassword: String!
    salt: String!
    resetToken: String
    resetTokenExpiresAt: DateTime
    expirePasswordPeriod: Int!
    expirePasswordStartDate: DateTime
    forceNewPasswordOnLogin: Boolean!
    passwordComplexityRules: String
    expiresAt: DateTime
    deletedAt: DateTime
    UserPreviousPasswords: [UserPreviousPassword]!
  }

  type Query {
    users: [User!]! @requireAuth
    user(id: Int!): User @requireAuth
  }

  input CreateUserInput {
    username: String!
    roles: String!
    expirePasswordPeriod: Int!
    expirePasswordStartDate: DateTime
    forceNewPasswordOnLogin: Boolean!
    passwordComplexityRules: String
    expiresAt: DateTime
    deletedAt: DateTime
  }

  input UpdateUserInput {
    username: String
    roles: String
    expirePasswordPeriod: Int
    expirePasswordStartDate: DateTime
    forceNewPasswordOnLogin: Boolean
    passwordComplexityRules: String
    expiresAt: DateTime
    deletedAt: DateTime
  }

  input UpdateUserPasswordInput {
    currentPassword: String!
    password: String!
    passwordConfirmation: String!
  }

  type Mutation {
    createUser(input: CreateUserInput!): String! @requireAuth
    updateUser(id: Int!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: Int!): User! @requireAuth
    updateUserPassword(id: Int!, input: UpdateUserPasswordInput!): Boolean!
      @requireAuth
  }
`
