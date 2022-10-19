import * as crypto from 'crypto'

import { AuthenticationError, ForbiddenError } from '@redwoodjs/graphql-server'

import { db } from './db'

/**
 * The session object sent in as the first argument to getCurrentUser() will
 * have a single key `id` containing the unique ID of the logged in user
 * (whatever field you set as `authFields.id` in your auth function config).
 * You'll need to update the call to `db` below if you use a different model
 * name or unique field name, for example:
 *
 *   return await db.profile.findUnique({ where: { email: session.id } })
 *                   ───┬───                       ──┬──
 *      model accessor ─┘      unique id field name ─┘
 *
 * !! BEWARE !! Anything returned from this function will be available to the
 * client--it becomes the content of `currentUser` on the web side (as well as
 * `context.currentUser` on the api side). You should carefully add additional
 * fields to the `select` object below once you've decided they are safe to be
 * seen if someone were to open the Web Inspector in their browser.
 */
export const getCurrentUser = async (session) => {
  if (!session || typeof session.id !== 'number') {
    throw new Error('Invalid session')
  }

  return await db.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      username: true,
      roles: true,
      forceNewPasswordOnLogin: true,
      expirePasswordStartDate: true,
      expirePasswordPeriod: true,
    },
  })
}

/**
 * The user is authenticated if there is a currentUser in the context
 *
 * @returns {boolean} - If the currentUser is authenticated
 */
export const isAuthenticated = () => {
  return !!context.currentUser
}

/**
 * When checking role membership, roles can be a single value, a list, or none.
 * You can use Prisma enums too (if you're using them for roles), just import your enum type from `@prisma/client`
 */

/**
 * Checks if the currentUser is authenticated (and assigned one of the given roles)
 *
 * @param roles: {@link AllowedRoles} - Checks if the currentUser is assigned one of these roles
 *
 * @returns {boolean} - Returns true if the currentUser is logged in and assigned one of the given roles,
 * or when no roles are provided to check against. Otherwise returns false.
 */
export const hasRole = (roles) => {
  if (!isAuthenticated()) {
    return false
  }

  if (context.currentUser?.forceNewPasswordOnLogin) {
    return false
  }

  const currentUserRoles = context.currentUser?.roles

  if (typeof roles === 'string') {
    if (typeof currentUserRoles === 'string') {
      // roles to check is a string, currentUser.roles is a string
      return currentUserRoles === roles
    } else if (Array.isArray(currentUserRoles)) {
      // roles to check is a string, currentUser.roles is an array
      return currentUserRoles?.some((allowedRole) => roles === allowedRole)
    }
  }

  if (Array.isArray(roles)) {
    if (Array.isArray(currentUserRoles)) {
      // roles to check is an array, currentUser.roles is an array
      return currentUserRoles?.some((allowedRole) =>
        roles.includes(allowedRole)
      )
    } else if (typeof currentUserRoles === 'string') {
      // roles to check is an array, currentUser.roles is a string
      return roles.some((allowedRole) => currentUserRoles === allowedRole)
    }
  }

  // roles not found
  return false
}

/**
 * Use requireAuth in your services to check that a user is logged in,
 * whether or not they are assigned a role, and optionally raise an
 * error if they're not.
 *
 * @param roles: {@link AllowedRoles} - When checking role membership, these roles grant access.
 *
 * @returns - If the currentUser is authenticated (and assigned one of the given roles)
 *
 * @throws {@link AuthenticationError} - If the currentUser is not authenticated
 * @throws {@link ForbiddenError} If the currentUser is not allowed due to role permissions
 *
 * @see https://github.com/redwoodjs/redwood/tree/main/packages/auth for examples
 */
export const requireAuth = ({ roles } = {}) => {
  if (!isAuthenticated()) {
    throw new AuthenticationError("You don't have permission to do that.")
  }

  if (roles && !hasRole(roles)) {
    throw new ForbiddenError("You don't have access to do that.")
  }
}

export const generatePassword = () => {
  const passwordLength = 6 // it'll be 16 characters long because of the hex encoding

  const bytes = Uint8Array.from(crypto.randomBytes(passwordLength * 2).values())

  const requiredSets = [
    'abcdefghijklmnopqrstuvwxyz',
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    '0123456789',
    '0123456789',
    '0123456789',
  ]

  const passwordBase = requiredSets.map((set, idx) => {
    return set[bytes[idx] % set.length]
  })

  passwordBase.push(
    ...Buffer.from(bytes.subarray(requiredSets.length)).toString('hex')
  )

  const lastBytes = bytes.subarray(passwordLength)

  for (let i = passwordBase.length - 1; i > 0; i--) {
    const j = lastBytes[i] % passwordBase.length

    ;[passwordBase[i], passwordBase[j]] = [passwordBase[j], passwordBase[i]]
  }

  return passwordBase.join('')
}

export class ResetPasswordForcedError extends Error {}
