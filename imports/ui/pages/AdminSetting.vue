<template>
  <div>
    <div class="row">
      <div class="col">
        <q-card
          flat
          bordered
        >
          <q-item class="text-grey-9">
            <q-item-section
              :key="`${activeCom}`"
              class="text-body1"
            >
              {{ comTitle }}
            </q-item-section>
          </q-item>

          <q-separator />

          <!-- Dynamic component -->
          <component
            :is="activeCom"
            class="admin-setting-content"
          />
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, computed, watch, defineAsyncComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'AdminSetting',
  components: {
    UserProfile: defineAsyncComponent(() =>
      import('./admin-setting/UserProfile.vue')
    ),
    Branch: defineAsyncComponent(() => import('./admin-setting/Branch.vue')),
    User: defineAsyncComponent(() => import('./admin-setting/User.vue')),
    Branch:defineAsyncComponent(()=>import('./admin-setting/Branch.vue')),
    // Employee: defineAsyncComponent(() => import('./admin-setting/User.vue')),
    Department:defineAsyncComponent(()=>import('./admin-setting/Department.vue')),
    Position:defineAsyncComponent(()=>import('./admin-setting/Position.vue')),
    EmployeeType:defineAsyncComponent(()=>import('./admin-setting/EmployeeType.vue'))
  },
  setup() {
    // Router
    const router = useRouter()
    const route = useRoute()

    // Admin setting menu
    const menuItems = reactive([
      {
        title: 'Profile',
        activeName: 'profile',
        icon: 'far fa-user-circle',
        route: { name: 'AdminSetting', params: { activeCom: 'profile' } },
        component: 'UserProfile',
      },
      {
        title: 'Branch',
        activeName: 'branch',
        icon: 'far fa-users',
        route: { name: 'AdminSetting', params: { activeCom: 'branch' } },
        component: 'Branch',
      },
     
      {
        title: 'Department',
        activeName: 'department',
        icon: 'far fa-users',
        route: { name: 'AdminSetting', params: { activeCom: 'department' } },
        component: 'Department',
      },
      {
        title: 'Position',
        activeName: 'position',
        icon: 'far fa-users',
        route: { name: 'AdminSetting', params: { activeCom: 'position' } },
        component: 'Position',
      },
      {
        title: 'Employee Type',
        activeName: 'employeeType',
        icon: 'far fa-users',
        route: { name: 'AdminSetting', params: { activeCom: 'employeeType' } },
        component: 'EmployeeType',
      },

      {
        title: 'User',
        activeName: 'user',
        icon: 'far fa-users',
        route: { name: 'AdminSetting', params: { activeCom: 'user' } },
        component: 'User',
      },
    ])

    // Active component
    const activeCom = ref('UserProfile')
    const comTitle = ref('Profile')
    const comIcon = ref('fas fa-user-circle')

    const activeName = computed(() => {
      return route.params?.activeCom || null
    })

    const changeCom = ({ route }) => {
      router.push(route)
    }

    const setActiveCom = (menu) => {
      comTitle.value = menu.title
      comIcon.value = menu.icon
      activeCom.value = menu.component
    }
    // On route change
    watch(
      activeName,
      (value) => {
        const defaultActive = {
          title: 'Profile',
          icon: 'fas fa-user-circle',
          component: 'UserProfile',
        }

        if (value && value) {
          const activeDoc = menuItems.find((menu) => menu.activeName === value)

          // Set active component
          if (activeDoc) setActiveCom(activeDoc)
          else setActiveCom(defaultActive)
        } else {
          setActiveCom(defaultActive)
        }
      },
      {
        immediate: true,
      }
    )

    return {
      activeName,
      activeCom,
      comTitle,
      comIcon,
      menuItems,

      changeCom,
    }
  },
}
</script>

<style lang="scss" scoped>
.menu {
  width: 250px;
  padding: 0 10px 0 0;
  .menu-scroller {
    width: 100%;
    height: calc(100vh - 175px);
  }
}

.admin-setting-content {
  overflow-y: auto;
  height: calc(100vh - 225px);
}
</style>
