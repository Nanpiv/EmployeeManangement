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
      name: 'insertUser',
      group: 'Admin',
      title: 'Form',
      order: 5
    },
    {
      name: 'updateUser',
      group: 'Admin',
      title: 'Form',
      order: 5
    },
    {
      name: 'removeUser',
      group: 'Admin',
      title: 'Form',
      order: 5
    },
    {
      name: 'insertDepartment',
      group: 'Admin',
      title: 'Form',
      order: 5
    },
    {
      name: 'updateDepartment',
      group: 'Admin',
      title: 'Form',
      order: 5
    },
    {
      name: 'removeDepartment',
      group: 'Admin',
      title: 'Form',
      order: 5
    },
    {
      name: 'insertPosition',
      group: 'Admin',
      title: 'Form',
      order: 5
    },
    {
      name: 'updatePosition',
      group: 'Admin',
      title: 'Form',
      order: 5
    },
    {
      name: 'removePosition',
      group: 'Admin',
      title: 'Form',
      order: 5
    },
    {
      name: 'insertEmployeeType',
      group: 'Admin',
      title: 'Form',
      order: 5
    },
    {
      name: 'updateEmployeeType',
      group: 'Admin',
      title: 'Form',
      order: 5
    },
    {
      name: 'removeEmployeeType',
      group: 'Admin',
      title: 'Form',
      order: 5
    },
    {
      name: 'insertEmployee',
      group: 'Employee',
      title: 'Employee',
      order: 4
    },
    {
      name: 'updateEmployee',
      group: 'Employee',
      title: 'Employee',
      order: 4
    },
    {
      name: 'removeEmployee',
      group: 'Employee',
      title: 'Employee',
      order: 4
    },
    {
      name: 'insertAttendance',
      group: 'Employee',
      title: 'Attendance',
      order: 4
    },
    {
      name: 'updateAttendance',
      group: 'Employee',
      title: 'Attendance',
      order: 4
    },
    {
      name: 'removeAttendance',
      group: 'Employee',
      title: 'Attendance',
      order: 4
    },
    {
      name: 'insertLeave',
      group: 'Employee',
      title: 'Leave',
      order: 4
    },
    {
      name: 'updateLeave',
      group: 'Employee',
      title: 'Leave',
      order: 4
    },
    {
      name: 'removeLeave',
      group: 'Employee',
      title: 'Leave',
      order: 4
    },
    {
      name: 'acceptLeave',
      group: 'Employee',
      title: 'Leave',
      order: 4
    },

  
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
