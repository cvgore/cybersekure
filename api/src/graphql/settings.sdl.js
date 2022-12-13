export const schema = gql`
  type Setting {
    key: String!
    value: String
  }

  type Query {
    settings: [Setting!]! @skipAuth
    setting(key: String!): Setting! @skipAuth
  }

  input UpdateSettingInput {
    key: String
    value: String
  }

  type Mutation {
    updateSetting(input: UpdateSettingInput!): Setting! @requireAuth
    activateApplication(input: String!): Boolean @requireAuth
  }
`
