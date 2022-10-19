export const standard = defineScenario({
  userPreviousPassword: {
    one: {
      data: {
        hashedPassword: 'String',
        salt: 'String',
        User: {
          create: {
            username: 'String1280637',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
      },
    },

    two: {
      data: {
        hashedPassword: 'String',
        salt: 'String',
        User: {
          create: {
            username: 'String820401',
            hashedPassword: 'String',
            salt: 'String',
          },
        },
      },
    },
  },
})
