<template>
    <q-table
      v-model:pagination="pagination"
      bordered
      flat
      :rows="data"
      :columns="columns"
      :filter="filter"
      :loading="loading"
      row-key="_id"
      @request="onChangePagination"
    >
      <template #top>
        <div class="q-gutter-x-md">
          <q-btn color="primary" no-caps icon="add" @click.prevent="addNew" v-if="$userIsInRole('insertAttendance')">
            Add
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
      <template #body-cell-employeeName="props">
        <q-td :props="props">
          <span @click="edit(props.row)" class="ra-text-link">
            {{ props.row.employeeName }}
          </span>
        </q-td>
      </template>
      <template #body-cell-branchName="props">
        <q-td :props="props">
         
            {{ props.row.branchName }}
         
        </q-td>
      </template>
      <template #body-cell-tranDate="props">
        <q-td :props="props">
         {{ formatTime(props.row.tranDate) }}
            <!-- {{ props.row.tranDate.toLocaleString('en-GB') }} -->
         
        </q-td>
      </template>
      <template #body-cell-reason="props">
        <q-td :props="props">
         
            {{ props.row.reason }}
         
        </q-td>
      </template>
    </q-table>
  
    <AttendanceForm
      :dialog="visibleDialog"
      :show-id="showId"
      @closed="handleClosedDialog"
    />
  </template>
  <script setup>
  import moment from 'moment'
  import { onMounted, ref,watch,computed } from 'vue'
  import Notify from '/imports/ui/lib/notify'
import AttendanceForm from './AttendanceForm.vue'
import { useStore } from '/imports/store'
  const columns = [
  { name: 'employeeName', label: 'Employee', field: 'employeeName',align:'left' },
    {
      name: 'type',
      label: 'Type',
      align: 'left',
      field: 'type',
    },
    { name: 'tranDate', label: 'Tran Date', field: 'tranDate',align:'left' },
    { name: 'reason', label: 'Reason', field: 'reason',align:'left' },
    { name: 'branchName', label: 'Branch', field: 'branchName',align:'left' },
  ]
  const store =useStore()
const currentBranchId = computed(()=>store.getters['app/currentBranchId'])

  const visibleDialog = ref(false)
  const loading = ref(false)
  // pagination
  const pagination = ref({
    sortBy: 'branchName',
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
  })
  const filter = ref('')
  const data = ref([])
  const showId = ref('')
  
  const addNew = () => {
    visibleDialog.value = true
  }
  //formatTime
  const formatTime = (date) => {
  return moment(date).format('YYYY-MM-DD hh:mm A')

}
  
  // method
  const fetchData = () => {
    loading.value = true
    const { page, rowsPerPage } = pagination.value
    let exp = new RegExp(filter.value)
    const query = { branchId:currentBranchId.value}
    if (filter.value) {
      query['$or'] = [
        // { tranDate: { $regex: exp, $options: 'i' } },
        { reason: { $regex: exp, $options: 'i' } },
        
      ]
    }
    
    const match = {
      page,
      rowsPerPage,
      selector: query,
    }

    Meteor.call('findAttendances', match, (err, res) => {


      if (err) {
        console.log('error', err)
        Notify.error({ message: err.reason || err })
      } else {
        // this.list = res
        // console.log('fetch attendance success',res.data)
        data.value = res.data || []
        pagination.value.rowsNumber = res.total || 0
      }
  
      loading.value = false
    })
  }
  const onChangePagination = (val) => {
    pagination.value = val.pagination
    fetchData()
  }
  
  const edit = (row) => {
    visibleDialog.value = true
    showId.value = row._id
  }
  
  const handleClosedDialog = (value) => {
    visibleDialog.value = value
    showId.value = ''
    fetchData()
  }
  
  // life cycle
  onMounted(() => {
    fetchData()
  })
  watch(()=>currentBranchId.value,()=>{
    console.log(currentBranchId.value,)
    fetchData()
  })
  </script>
  