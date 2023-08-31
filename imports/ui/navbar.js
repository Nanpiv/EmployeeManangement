export default [
  {
    title: 'Dashboard',
    route: { name: 'Dashboard' },
    icon: 'fa-solid fa-gauge',
  },
  {
    title: "Employee",
    route: { name: "Employee" },
    icon: "fa-solid fa-users",
  },
  {
    title: "Attendance",
    route: { name: "Attendance" },
    icon: "fa-solid fa-list-check",
  },
  {
    title: "Leave",
    route: { name: "Leave" },
    icon: "fa-solid fa-list",
  },
  // {
  //   title: "Notifications",
  //   route: { name: "Notifications" },
  //   icon: "fa-solid fa-list",
  // },
  {
    title: "Report",
    route: { name: "Report" },
    icon: "fa-solid fa-file-contract",
  },
  {
    title: 'Admin Setting',
    icon: 'fa-solid fa-user-cog',
    group: 'admin',
    route: { name: 'AdminSetting', params: { activeCom: 'profile' } },
    children: [
      {
        title: 'Profile',
        route: { name: 'AdminSetting', params: { activeCom: 'profile' } },
        icon: 'fa-solid fa-user-circle',
        group: 'admin',
        
      },
      {
        title: "Branch",
        route: { name: "AdminSetting", params: { activeCom: "branch" } },
        icon: 'fa-solid fa-code-branch',
        group: "admin",
      },
      {
        title: "Department",
        route: { name: "AdminSetting", params: { activeCom: "department" } },
        icon: "fa-solid fa-user",
        group: "admin",
      },
      {
        title: "Position",
        route: { name: "AdminSetting", params: { activeCom: "position" } },
        group: "admin",
        icon: "fa-solid fa-users-gear",
        // roles: ['admin'],
      },
      {
        title: "EmployeeType",
        route: { name: "AdminSetting", params: { activeCom: "employeeType" } },
        group: "admin",
        icon: "fa-solid fa-users-gear",
        // roles: ['admin'],
        roles: ['insertBranch','updateBranch','removeBranch'],
      },
     
      {
        title: 'User',
        route: { name: 'AdminSetting', params: { activeCom: 'user' } },
        group: 'admin',
        icon: 'fa-solid fa-users',
        roles: ['insertUser,updateUser','removeUser'],
      },
      {
        title: 'Group',
        route: { name: 'AdminSetting', params: { activeCom: 'group' } },
        group: 'admin',
        icon: 'fa-solid fa-users',
        roles: ['insertRoleGroup','updateRoleGroup','removeRoleGroup'],
      },
    ],
  },
]
