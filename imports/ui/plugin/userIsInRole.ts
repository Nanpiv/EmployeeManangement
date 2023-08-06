import { Meteor } from 'meteor/meteor'
import { App } from 'vue'
import { Session } from 'meteor/session'
import { isString, isArray, intersection } from 'lodash'

export default {
  install(app: App) {
    app.config.globalProperties.$userIsInRole = userIsInRole
    app.provide('$userIsInRole', userIsInRole)
  },
}

const userIsInRole = (roles: string | string[], overpower = true) => {
  const currentUser = Meteor.user() || Session.get('currentUser')
  const currentUserRoles = currentUser?.profile?.roles || []

  let userRoles: string[] = []
  // Allow user super
  if (overpower) userRoles = ['super']

  if (isString(roles)) {
    userRoles.push(roles)
  } else if (isArray(roles)) {
    userRoles = userRoles.concat(roles)
  }
  const result = intersection(currentUserRoles, userRoles)

  return result.length ? true : false
}
