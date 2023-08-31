<template>
  <q-card class="my-card" >
    <q-card-section>
      <div class="row collapse-list">
        <template v-for="(item, index) in list" :key="index">
          <div class="list-title" style="width: 30%; margin-right: 2.5%" >
            <div class="content-panel" @click="handleLink(item.route)" >
              <i class="fa-solid fa-file-contract"></i>
              {{ item.title }}
            </div>
          </div>
        </template>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import reportMenu from '/imports/ui/reportMenu'

const router = useRouter()

const list = ref(reportMenu)

const handleLink = (route) => {
  if (!route) return
  router.push(route)
}
</script>
<style lang="scss" scoped>
.ra-fieldset {
  padding: 10px 15px;
}
.fas {
  color: #909399;
}
@import './imports/ui/styles/report-center.scss';
</style>
