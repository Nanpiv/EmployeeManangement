import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

Meteor.startup(async () => {
  // Super
  const superAccount = Accounts.findUserByUsername('super')
  if (!superAccount) {

    const user = {
      username: 'super',
      email: 'super@rabbit.com',
      password: '123456',
      profile: {
        fullName: 'Super',
        status: 'Active',

      },
    }

    Accounts.createUser(user)
  }
})
