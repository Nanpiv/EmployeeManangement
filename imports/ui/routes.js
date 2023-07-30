import Dashboard from "./pages/Dashboard.vue";
import Login from "./pages/Login.vue";
import Employee from "./pages/Employees.vue"
import Attendance from "./pages/Attendance.vue"
// Setting
import AdimSetting from "./pages/AdminSetting.vue";
// import Branch from "./pages/admin-setting/Branch.vue"
// Not found
import NotFound from "./pages/NotFound.vue";

// Report
import Report from "./reports/index.vue";
import Sample from "./reports/Sample.vue";

export default [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      title: "Dashboard",
    },
  },
  {
    path: "/attendance",
    name: "Attendance",
    component: Attendance,
    meta: {
      title: "Attendance",
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      public: true,
      layout: "Login",
    },
  },
  {
    path: "/admin-setting/:activeCom?",
    name: "AdminSetting",
    component: AdimSetting,
    meta: {
      title: "Admin Setting",
      breadcrumb: {
        parent: "Dashboard",
      },
    },
  },

  // NotFound
  {
    path: "/:catchAll(.*)",
    name: "notFound",
    component: NotFound,
    meta: {
      title: "Not Found",
    },
  },

  // Report
  {
    path: "/report",
    name: "Report",
    component: Report,
    meta: {
      title: "Report",
      breadcrumb: {
        parent: "Dashboard",
      },
    },
  },
  {
    path: "/employee",
    name: "Employee",
    component: Employee,
    meta: {
      title: "Employee",
      breadcrumb: {
        parent: "Dashboard",
      },
    },
  },
  {
    path: "/sample",
    name: "Sample",
    component: Sample,
    meta: {
      title: "Sample",
      breadcrumb: {
        parent: "Report",
      },
    },
  },
];
