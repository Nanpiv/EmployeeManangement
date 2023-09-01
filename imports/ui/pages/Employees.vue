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
          <q-btn color="primary" no-caps icon="add" @click.prevent="addNew" v-if="$userIsInRole('insertEmployee')">
            Add
          </q-btn>
        </div>
  
        <q-space />
  
        <q-input
          v-model="filter"
          outlined
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
          <span @click="edit(props.row)" class="ra-text-link">
            {{ props.row.name }}
          </span>
        </q-td>
      </template>
      <template #body-cell-branchName="props">
        <q-td :props="props">
         
            {{ props.row.branchName }}
         
        </q-td>
      </template>
      <template #body-cell-checkIn="props">
        <q-td :props="props">
         
          {{ formatTime(props.row.checkIn) }}
         
        </q-td>
      </template>
      <template #body-cell-checkOut="props">
        <q-td :props="props">
         
          {{ formatTime(props.row.checkOut) }}
         
        </q-td>
      </template>
      <template #body-cell-startDate="props">
        <q-td :props="props">
         
        {{ props.row.startDate.toLocaleDateString('zh-Hans-CN') }}
         
        </q-td>
      </template>
    </q-table>
  
    <EmployeeForm
      :dialog="visibleDialog"
      :show-id="showId"
      @closed="handleClosedDialog"
    />
  </template>
  <script setup>
    import moment from "moment";
  import { onMounted, ref,watch,computed } from 'vue'
  import Notify from '/imports/ui/lib/notify'
import EmployeeForm from './EmployeeForm.vue'
import { useStore } from '/imports/store'
  const columns = [
    {name: 'name',label: 'Name',align: 'left',field: 'name' },
    { name: 'typeName', label: 'Type', field: 'typeName',align:'left' },
    { name: 'positionName', label: 'Position', field: 'positionName',align:'left' },
    { name: 'address', label: 'Address', field: 'address',align:'left' },
    { name: 'telephone', label: 'Telephone', field: 'telephone',align:'left' },
    { name: 'startDate', label: 'Start Date', field: 'startDate',align:'left'  },
    { name: 'branchName', label: 'Branch', field: 'branchName' ,align:'left' },
    { name: 'checkIn', label: 'Check In', field: 'checkIn',align:'left'  },
    { name: 'checkOut', label: 'Check Out', field: 'checkOut',align:'left'  },
    // { name: 'token', label: 'Token', field: 'token' },
  ]
  const store =useStore()
const currentBranchId = computed(()=>store.getters['app/currentBranchId'])

  const visibleDialog = ref(false)
  const loading = ref(false)
  // pagination
  const pagination = ref({
    sortBy: 'name',
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
  return moment(date).format('hh:mm A')

}
  
  // method
  const fetchData = () => {
    loading.value = true
    const { page, rowsPerPage } = pagination.value
    let exp = new RegExp(filter.value)
    const query = { branchId:currentBranchId.value}
    if (filter.value) {
      query['$or'] = [
        { name: { $regex: exp, $options: 'i' } },
        { status: { $regex: exp, $options: 'i' } },
        
      ]
    }
    
    const match = {
      page,
      rowsPerPage,
      selector: query,
    }

    Meteor.call('findEmployee', match, (err, res) => {


      if (err) {
        console.log('error', err)
        Notify.error({ message: err.reason || err })
      } else {
        // this.list = res
        // console.log('fetch employee success',res.data)
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
    // console.log(currentBranchId.value,)
    fetchData()
  })
  </script>
  