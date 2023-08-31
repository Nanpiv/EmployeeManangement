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
    roles: ['insertEmployee','updateEmployee','removeEmployee'],
  },
  {
    title: "Attendance",
    route: { name: "Attendance" },
    icon: "fa-solid fa-list-check",
    roles: ['insertAttendance','updateAttendance','removeAttendance'],
  },
  {
    title: "Leave",
    route: { name: "Leave" },
    icon: "fa-solid fa-list",
    roles: ['insertLeave','updateLeave','removeLeave'],
  },
  {
    title: "Report",
    route: { name: "Report" },
    icon: "fa-solid fa-file-contract",
    roles: ['insertReport','updateReport','removeReport'],
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
        roles: ['insertBranch','updateBranch','removeBranch'],
      },
      {
        title: "Department",
        route: { name: "AdminSetting", params: { activeCom: "department" } },
        icon: "fa-solid fa-user",
        group: "admin",
        roles: ['insertDepartment','updateDepartment','removeDepartment'],
      },
      {
        title: "Position",
        route: { name: "AdminSetting", params: { activeCom: "position" } },
        group: "admin",
        icon: "fa-solid fa-users-gear",
        roles: ['insertPosition','updatePosition','removePosition'],
      },
      {
        title: "EmployeeType",
        route: { name: "AdminSetting", params: { activeCom: "employeeType" } },
        group: "admin",
        icon: "fa-solid fa-users-gear",
        // roles: ['admin'],
        roles: ['insertEmployeeType','updateEmployeeType','removeEmployeeType'],
      },
     
      {
        title: 'User',
        route: { name: 'AdminSetting', params: { activeCom: 'user' } },
        group: 'admin',
        icon: 'fa-solid fa-users',
        roles: ['insertUser','updateUser','removeUser'],
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
