import * as crypto from 'crypto'

import { hashPassword, ServiceValidationError } from '@redwoodjs/api'
import { validateWith } from '@redwoodjs/api'

import { generatePassword } from 'src/lib/auth'
import { db } from 'src/lib/db'
import { deserializePcr } from 'src/lib/password'

export const users = () => {
  return db.user.findMany()
}

export const user = ({ id }) => {
  return db.user.findUnique({
    where: { id },
  })
}

export const createUser = async ({ input }) => {
  const password = generatePassword()
  const [hashedPassword, salt] = hashPassword(password)
  const { password: _, ...filteredInput } = { ...input, hashedPassword, salt }

  await db.user.create({
    data: filteredInput,
  })

  return password
}

export const updateUser = ({ id, input }) => {
  return db.user.update({
    data: input,
    where: { id },
  })
}

export const updateUserPassword = async ({ id, input }) => {
  const user = await db.user.findUnique({ where: { id } })
  const [currentHashedPassword] = hashPassword(input.currentPassword, user.salt)
  const [hashedPassword, salt] = hashPassword(input.password, user.salt)

  validateWith(() => {
    if (context.currentUser.id !== id && context.currentUser.role !== 'admin') {
      throw new ServiceValidationError(
        'Only the current user can update their password'
      )
    }
  })

  validateWith(() => {
    if (
      !crypto.timingSafeEqual(
        Buffer.from(currentHashedPassword),
        Buffer.from(user.hashedPassword)
      )
    ) {
      throw new ServiceValidationError('Current password is incorrect')
    }
  })

  validateWith(() => {
    if (input.password !== input.passwordConfirmation) {
      throw new ServiceValidationError('Password confirmation does not match')
    }
  })

  if (user.passwordComplexityRules) {
    validateWith(() => {
      const rules = deserializePcr(user.passwordComplexityRules)

      if (
        rules.pcrMinLength > 0 &&
        input.password.length < rules.pcrMinLength
      ) {
        throw new ServiceValidationError(
          `Password must be at least ${rules.pcrMinLength} characters`
        )
      }

      if (rules.pcrSpecialChars && !input.password.match(/[^a-zA-Z]/)) {
        throw new ServiceValidationError(
          'Password must contain at least one special character or digit'
        )
      }

      if (rules.pcrLetters && !input.password.match(/[a-zA-Z]/)) {
        throw new ServiceValidationError(
          'Password must contain at least one letter'
        )
      }
    })
  }

  if (
    await db.userPreviousPassword.findFirst({
      where: { userId: id, hashedPassword, salt },
    })
  ) {
    throw new ServiceValidationError(
      'New password must be different from any previously used passwords'
    )
  }

  if (
    user.expirePasswordPeriod > 0 &&
    user.expirePasswordStartDate &&
    new Date(user.expirePasswordStartDate).getTime() +
      user.expirePasswordPeriod * 86_400_000 <
      new Date().getTime()
  ) {
    await db.user.update({
      data: {
        hashedPassword,
        salt,
        expirePasswordStartDate: new Date(),
      },
      where: { id },
    })
  } else if (user.forceNewPasswordOnLogin) {
    await db.user.update({
      data: {
        hashedPassword,
        salt,
        forceNewPasswordOnLogin: false,
      },
      where: { id },
    })
  }

  await db.userPreviousPassword.create({
    data: {
      hashedPassword,
      salt,
      User: {
        connect: { id },
      },
    },
  })

  return true
}

export const deleteUser = ({ id }) => {
  return db.user.delete({
    where: { id },
  })
}

export const User = {
  UserPreviousPasswords: (_obj, { root }) => {
    return db.user
      .findUnique({ where: { id: root?.id } })
      .UserPreviousPasswords()
  },
}
