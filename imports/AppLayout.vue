<template>
  <div>
    <transition
      name="fade"
      mode="out-in"
    >
      <component :is="layout"> </component>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '/imports/store'
// import { useI18n } from 'vue-i18n'
import { useSubscribe, useAutorun } from 'vue-meteor-tracker'

// import Company from '/imports/api/company/company.js'
import Branches from '/imports/api/branches/branches'
// Layouts
import layouts from './ui/layouts'

type Layout = keyof typeof layouts

const route = useRoute()
const store = useStore()
// const i18n = useI18n()
// const $userIsInRole = inject(`$userIsInRole`)

// load current user
store.dispatch('app/loadCurrentUser')
const currentUser = computed(() => store.state.app.currentUser)

// Dynamic layout
const layout = computed(() => {
  const layout: Layout = (route?.meta?.layout as Layout) || 'Main'

  return layouts[layout] || layouts['Main']
})

// Subscribe
const { subscribe } = useSubscribe()
const { autorun } = useAutorun()

// const { ready: companyReady } = subscribe('app.company')
// const company = autoResult(() => {
//   if (companyReady.value) return Company.findOne()
// })

const branchSelector = computed(() => {
  return currentUser?.value?.profile?.allowedBranches || []
})

const { ready: branchReady } = subscribe(() => [
  'app.branches',
  {
    _id: { $in: branchSelector.value },
  },
])

const { result: branches } = autorun(() => {
  if (branchReady.value) return Branches.find().fetch()

  return []
})
// // Watch
// watch(company, (value) => {
//   // Set default Lang
//   i18n.locale.value = value?.setting?.lang || 'en'
//   store.dispatch('app/updateCompany', value)
// })
watch(branches, (value) => store.dispatch('app/updateAllowedBranches', value))
</script>
