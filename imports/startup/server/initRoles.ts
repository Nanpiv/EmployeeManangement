import { Mongo } from "meteor/mongo"

import Role from '../../api/roles/roles'

export const initRoles = async () => {
  const roles = [
    {
      name: 'insertBranch',
      group: 'Admin',
      title: 'Form',
      order: 5
    },
    {
      name: 'updateBranch',
      group: 'Admin',
      title: 'Form',
      order: 5
    },
    {
      name: 'removeBranch',
      group: 'Admin',
      title: 'Form',
      order: 5
    },
    {
      name: 'insertRoleGroup',
      group: 'Admin',
      title: 'Form',
      order: 5
    },
    {
      name: 'updateRoleGroup',
      group: 'Admin',
      title: 'Form',
      order: 5
    },
    {
      name: 'removeRoleGroup',
      group: 'Admin',
      title: 'Form',
      order: 5
    },
    {
      name: 'viewBranch',
      group: 'User',
      title: 'Form',
      order: 4
    },
    {
      name: 'viewReportBranch',
      group: 'User',
      title: 'Report',
      order: 4
    },
    {
      name: ' viewUser',
      group: 'User',
      title: 'SideBar',
      order: 4
    },
    {
      name: ' updateUser',
      group: 'User',
      title: 'SideBar',
      order: 4
    },
    {
      name: ' removeUser',
      group: 'User',
      title: 'SideBar',
      order: 4
    },
    {
      name: ' viewReport',
      group: 'User',
      title: 'SideBar',
      order: 4
    },
    {
      name: ' viewUserProfile',
      group: 'User',
      title: 'SideBar',
      order: 4
    },
    {
      name:'viewDashboard',
      group:'User',
      title:'SideBar',
      order:4
    }
  ]
 

  // Loop check exist role
  for (let i = 0; i < roles.length; i++) {
    const it: any = roles[i]

    const exist = Role.findOne({ name: it.name })
    if (!exist) {
      const _id = new Mongo.ObjectID().toHexString()
      it._id = _id
      // insert role group
      Role.insert(it)
    }
  }
}
