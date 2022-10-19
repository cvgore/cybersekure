import { db } from 'src/lib/db'

export const userPreviousPasswords = () => {
  return db.userPreviousPassword.findMany()
}

export const userPreviousPassword = ({ id }) => {
  return db.userPreviousPassword.findUnique({
    where: { id },
  })
}

export const createUserPreviousPassword = ({ input }) => {
  return db.userPreviousPassword.create({
    data: input,
  })
}

export const updateUserPreviousPassword = ({ id, input }) => {
  return db.userPreviousPassword.update({
    data: input,
    where: { id },
  })
}

export const deleteUserPreviousPassword = ({ id }) => {
  return db.userPreviousPassword.delete({
    where: { id },
  })
}

export const UserPreviousPassword = {
  User: (_obj, { root }) => {
    return db.userPreviousPassword
      .findUnique({ where: { id: root?.id } })
      .User()
  },
}
