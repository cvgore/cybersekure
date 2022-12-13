export const schema = gql`
  type Activity {
    id: Int!
    userId: Int!
    User: User!
    type: String!
    payload: String
    createdAt: DateTime!
  }

  type Query {
    activities: [Activity!]! @requireAuth
    activity(id: Int!): Activity @requireAuth
  }

  input CreateActivityInput {
    userId: Int!
    type: String!
    payload: String
  }

  input UpdateActivityInput {
    userId: Int
    type: String
    payload: String
  }

  type Mutation {
    createActivity(input: CreateActivityInput!): Activity! @requireAuth
    updateActivity(id: Int!, input: UpdateActivityInput!): Activity!
      @requireAuth
    deleteActivity(id: Int!): Activity! @requireAuth
  }
`
