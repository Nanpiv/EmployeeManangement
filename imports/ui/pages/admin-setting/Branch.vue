<template>
  <q-card>
    <q-card-section>
      <q-table
        v-model:pagination="pagination"
        title="User"
        :rows="dataTable"
        :columns="columns"
        row-key="_id"
        :filter="filter"
      >
        <template #top>
          <div class="q-gutter-x-md">
            <q-btn
              color="primary"
              no-caps
              @click="addNew"
            >
              Add New
            </q-btn>
          </div>

          <q-space />

          <q-input
            v-model="filter"
            borderless
            dense
            debounce="300"
            placeholder="Search"
          >
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template #body-cell-name="props">
          <q-td :props="props">
            <span
              class="ra-text-link"
              @click="edit(props.row)"
            >
              {{ props.row.name }}
            </span>
          </q-td>
        </template>

        <template #body-cell-checkIn="props">
          <q-td :props="props">
            <span>
              {{ formatTime(props.row.checkIn) }}
            </span>
          </q-td>
        </template>

        <template #body-cell-checkOut="props">
          <q-td :props="props">
            <span>
              {{ formatTime(props.row.checkOut) }}
            </span>
          </q-td>
        </template>
      </q-table>
    </q-card-section>

    <!-- Component -->
    <Component
      :is="currentModal"
      v-model="visibleModal"
      :show-id="showId"
      @closed="handleModelClose"
    />
  </q-card>
</template>
<script setup>
import { ref, defineAsyncComponent, nextTick, onMounted, shallowRef } from 'vue'
import moment from 'moment'
import Notify from '../../lib/notify.js'
const BranchForm = shallowRef(
  defineAsyncComponent(() => import('./BranchForm.vue'))
)

// Composables
import useMethod from '../../composables/useMethod'

// State
const pagination = ref({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 10,
})

const filter = ref('')
const columns = ref([
  {
    name: 'name',
    label: 'Name',
    align: 'left',
    field: 'name',
    sortable: true,
  },
  {
    name: 'Address',
    align: 'left',
    label: 'Address',
    field: 'address',
    sortable: true,
  },
  {
    name: 'checkIn',
    align: 'left',
    label: 'Check In',
    field: 'checkIn',
    sortable: true,
  },
  {
    name: 'checkOut',
    align: 'left',
    label: 'Check Out',
    field: 'checkOut',
    sortable: true,
  },
])

const dataTable = ref([])

// Form
const currentModal = shallowRef(null)
const visibleModal = ref(false)
const showId = ref(null)

const getDataTable = () => {
  const { call } = useMethod('fetchBranches')
  call({})
    .then((result) => {
      dataTable.value = result
    })
    .catch((error) => {
      Notify.error({ message: error.reason || error })
      dataTable.value = []
    })
}

const addNew = () => {
  visibleModal.value = true
  nextTick(() => {
    currentModal.value = BranchForm.value
  })
}

const edit = (row) => {
  showId.value = row._id
  visibleModal.value = true
  nextTick(() => {
    currentModal.value = BranchForm.value
  })
}

const formatTime = (date) => {
  return moment(date).format('HH:mm A')
}

const handleModelClose = () => {
  visibleModal.value = false
  nextTick(() => {
    showId.value = null
    currentModal.value = null

    getDataTable()
  })
}

onMounted(() => {
  getDataTable()
})
</script>
