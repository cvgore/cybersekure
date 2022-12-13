import {
  activities,
  activity,
  createActivity,
  updateActivity,
  deleteActivity,
} from './activities'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float and DateTime types.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('activities', () => {
  scenario('returns all activities', async (scenario) => {
    const result = await activities()

    expect(result.length).toEqual(Object.keys(scenario.activity).length)
  })

  scenario('returns a single activity', async (scenario) => {
    const result = await activity({ id: scenario.activity.one.id })

    expect(result).toEqual(scenario.activity.one)
  })

  scenario('creates a activity', async (scenario) => {
    const result = await createActivity({
      input: {
        userId: scenario.activity.two.userId,
        type: 'String',
        createdAt: '2022-11-09T21:13:47Z',
      },
    })

    expect(result.userId).toEqual(scenario.activity.two.userId)
    expect(result.type).toEqual('String')
    expect(result.createdAt).toEqual('2022-11-09T21:13:47Z')
  })

  scenario('updates a activity', async (scenario) => {
    const original = await activity({
      id: scenario.activity.one.id,
    })

    const result = await updateActivity({
      id: original.id,
      input: { type: 'String2' },
    })

    expect(result.type).toEqual('String2')
  })

  scenario('deletes a activity', async (scenario) => {
    const original = await deleteActivity({
      id: scenario.activity.one.id,
    })

    const result = await activity({ id: original.id })

    expect(result).toEqual(null)
  })
})
