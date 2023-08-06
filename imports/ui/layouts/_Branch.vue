<template>
  <q-btn
    flat
    dense
    :label="currentBranch"
  >
    <q-menu
      :offset="[-30, 13]"
      self="top middle"
      square
      transition-show="scale"
      transition-hide="scale"
    >
      <!-- Header -->
      <q-list style="padding: 5px 0">
        <q-item
          v-for="branch in allowedBranches"
          :key="branch._id"
          v-close-popup
          clickable
          dense
          @click="handleCommand(branch)"
        >
          <q-item-section>
            {{ branch.name }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '/imports/store'
// Component

const store = useStore()

const allowedBranches = computed(() => {
  return store.state.app.allowedBranches
})

const currentBranch = computed(() => {
  const branch = store.state.app.currentBranch
  return branch && `${branch.name}`
})

const handleCommand = (branch) => {
  store.dispatch('app/updateCurrentBranch', branch)
}
</script>
