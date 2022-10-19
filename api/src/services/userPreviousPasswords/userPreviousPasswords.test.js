import {
  userPreviousPasswords,
  userPreviousPassword,
  createUserPreviousPassword,
  updateUserPreviousPassword,
  deleteUserPreviousPassword,
} from './userPreviousPasswords'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float and DateTime types.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('userPreviousPasswords', () => {
  scenario('returns all userPreviousPasswords', async (scenario) => {
    const result = await userPreviousPasswords()

    expect(result.length).toEqual(
      Object.keys(scenario.userPreviousPassword).length
    )
  })

  scenario('returns a single userPreviousPassword', async (scenario) => {
    const result = await userPreviousPassword({
      id: scenario.userPreviousPassword.one.id,
    })

    expect(result).toEqual(scenario.userPreviousPassword.one)
  })

  scenario('creates a userPreviousPassword', async (scenario) => {
    const result = await createUserPreviousPassword({
      input: {
        userId: scenario.userPreviousPassword.two.userId,
        hashedPassword: 'String',
        salt: 'String',
      },
    })

    expect(result.userId).toEqual(scenario.userPreviousPassword.two.userId)
    expect(result.hashedPassword).toEqual('String')
    expect(result.salt).toEqual('String')
  })

  scenario('updates a userPreviousPassword', async (scenario) => {
    const original = await userPreviousPassword({
      id: scenario.userPreviousPassword.one.id,
    })

    const result = await updateUserPreviousPassword({
      id: original.id,
      input: { hashedPassword: 'String2' },
    })

    expect(result.hashedPassword).toEqual('String2')
  })

  scenario('deletes a userPreviousPassword', async (scenario) => {
    const original = await deleteUserPreviousPassword({
      id: scenario.userPreviousPassword.one.id,
    })

    const result = await userPreviousPassword({ id: original.id })

    expect(result).toEqual(null)
  })
})
