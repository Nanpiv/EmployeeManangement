<template>
  <q-btn
    round
    unelevated
  >
    <q-avatar size="30px">
      <img
        src="/images/user-avatar.png"
        class="cursor-pointer"
      />
    </q-avatar>

    <q-menu
      :offset="[-40, 9]"
      self="top right"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-list
        style="min-width: 200px"
        class="admin-setting-menu"
      >
        <q-item>
          <q-item-section>
            <q-item-label class="text-subtitle2 text-weight-bold text-grey-9">
              {{ fullName }}
            </q-item-label>
            <q-item-label
              lines="1"
              class="text-grey-8"
            >
              {{ username }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <template
          v-for="(menu, index) in adminMenu"
          :key="index"
        >
          <!-- Separator only above logout -->
          <q-separator
            v-if="menu.id === 'logout'"
            :key="`separator-${index}`"
          />
          <!-- Item -->
          <q-item
            v-close-popup
            clickable
            @click="userMenuClick(menu)"
          >
            <q-item-section
              v-if="menu.icon"
              avatar
            >
              <q-icon
                :name="menu.icon"
                :color="menu.color"
              />
            </q-item-section>
            <q-item-section class="text-grey-9">
              {{ menu.title }}
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup>
import { reactive, computed, nextTick } from 'vue'
import { useStore } from '/imports/store'
import { useRouter } from 'vue-router'
// import { useI18n } from 'vue-i18n'
import Notify from '../lib/notify'
import useAuth from '../composables/useAuth'
import {
  QBtn,
  QAvatar,
  QMenu,
  QList,
  QItem,
  QItemSection,
  QSeparator,
} from 'quasar'

const { logout } = useAuth()
const store = useStore()
const router = useRouter()
// const { locale: i18nLocal, t } = useI18n()

const username = computed(() => store.state.app.currentUser.username)
const fullName = computed(() => store.getters['app/userFullName'])
const adminMenu = reactive([
  {
    id: 'profile',
    title: 'Profile',
    color: 'primary',
    icon: 'fas fa-user-circle',
  },
  {
    id: 'lang',
    title: 'Language',
    color: 'green-8 ',
    icon: 'fas fa-language',
  },
  {
    id: 'logout',
    title: 'Logout',
    color: 'negative',
    icon: 'fas fa-sign-out-alt',
  },
])

const userMenuClick = (item) => {
  if (item.id === 'profile') {
    router.push({ name: 'AdminSetting', params: { activeCom: 'profile' } })
  } else if (item.id === 'lang') {
    // i18nLocal.value = i18nLocal.value === 'en' ? 'km' : 'en'

    nextTick(() => {
      // store.dispatch('app/updateLang', i18nLocal.value)
      Notify.success({
        message: `Language switched to English`,
      })
    })
  } else if (item.id === 'logout') {
    logout()
  }
}
</script>

<style lang="scss">
.admin-setting-menu {
  .q-item {
    .q-item__section--avatar {
      color: #909399;
      min-width: auto;
      padding-right: 10px;
      padding-left: 5px;
      i {
        font-size: 18px !important;
      }
    }
  }
}
</style>
