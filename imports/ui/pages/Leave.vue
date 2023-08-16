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
          <q-btn color="primary" no-caps icon="add" @click.prevent="addNew">
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
         
            {{ props.row.tranDate.toLocaleString('en-GB') }}
         
        </q-td>
      </template>
      <template #body-cell-reason="props">
        <q-td :props="props">
         
            {{ props.row.reason }}
         
        </q-td>
      </template>
      <template #body-cell-fromDate="props">
        <q-td :props="props">
         
          {{ formatTime(props.row.fromDate) }}
         
        </q-td>
      </template>
      <template #body-cell-toDate="props">
        <q-td :props="props">
          {{ formatTime(props.row.toDate) }}
        </q-td>
      </template>
      <!-- <template #body-cell-status="props">
        <q-td :props="props">
          {{props.row.status }}
        </q-td>
      </template> -->
      <template #body-cell-action="props">
        <q-td :props="props" v-if="props.row.status === 'active'" >
          <q-btn 
          class="q-mr-md"
          icon="done"
          color="primary" @click="updateStatus(props.row,status = 'accepted',acceptedById=currentUser) " 
          >Accept</q-btn>
          <q-btn   @click="updateStatus(props.row,status = 'canceled',acceptedById=currentUser)" 
          icon="close"
          color="red"
          >Cancel</q-btn>
        </q-td>
        <q-td :props="props" v-else disabled >
          <q-btn 
          class="q-mr-md"
          color="grey" 
          >
          <q-icon v-if="props.row.status === 'accepted'" name="done"> </q-icon>
          <q-icon v-else name="close"> </q-icon>
          {{ props.row.status }}
        </q-btn>  
         
        </q-td>
      </template>
    </q-table>
  
    <LeaveForm
      :dialog="visibleDialog"
      :show-id="showId"
      @closed="handleClosedDialog"
    />
  </template>
  <script setup>

  import { onMounted, ref,watch,computed } from 'vue'
  import Notify from '/imports/ui/lib/notify'
  import LeaveForm from './LeaveForm.vue'
  import { useStore } from '/imports/store'
  import moment from 'moment'
import { Meteor } from 'meteor/meteor'


  // pagination
  const pagination = ref({
    sortBy: 'name',
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
  })


  const columns = [
    { name: 'tranDate', label: 'Tran Date', field: 'tranDate',align:'left',sort: (a, b) => complicatedCompare(a, b),sortable:true},
    { name: 'employeeName', label: 'Employee', field: 'employeeName',align:'left'},
    { name: 'reason', label: 'Reason', field: 'reason',align:'left' },
    { name: 'type', label: 'Type', field: 'type',align:'left' },
    { name: 'fromDate', label: 'From Date', field: 'fromDate',align:'left' },
    { name: 'toDate', label: 'To Date', field: 'toDate',align:'left' },
    { name: 'acceptedById', label: 'Accetped By', field: 'acceptedById',align:'left' },
    // { name: 'branchName', label: 'Branch', field: 'branchName',align:'left' },
    // { name: 'status', label: 'Status', field: 'status',align:'left' },
    { name: 'action', label: 'Status', field: 'action',align:'left' }
  ]
  const store =useStore()
const currentBranchId = computed(()=>store.getters['app/currentBranchId'])
const currentUser =computed(()=>store.getters['app/userFullName'])
  const visibleDialog = ref(false)
  const loading = ref(false)

  const filter = ref('')
  const data = ref([])
  const showId = ref('')
  
  const addNew = () => {
    visibleDialog.value = true
  }
  //fromart time date
  const formatTime = (date) => {

return moment(date).format('YYYY/MM/DD hh:mm A')
}


  // method
  const fetchData = () => {
    loading.value = true
    const { page, rowsPerPage } = pagination.value
    let exp = new RegExp(filter.value)
    const query = { branchId:currentBranchId.value}
    if (filter.value) {
      query['$or'] = [
        { employeeName: { $regex: exp, $options: 'i' } },
        { reason: { $regex: exp, $options: 'i' } },
        
      ]
    }
    
    const match = {
      page,
      rowsPerPage,
      selector: query,
    }

    Meteor.call('findLeaves', match, (err, res) => {
      if (err) {
        console.log('error', err)
        Notify.error({ message: err.reason || err })
      } else {
        // this.list = res
        // console.log('fetch leaves success',res.data)
        data.value = res.data || []

        // res.data.status==='accepted' || 'canceled' ? display.value= false: display.value =true
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

  const display = ref('true')

  // update status
  const updateStatus = (item, status,acceptedById)=>{
    console.log('status', status);
    let _id = item._id
    Meteor.call('updateStatusAccepted', { _id,status,acceptedById} ,(err,res)=>{
      if(!err){
        // console.log('sucess update status')
        fetchData()
        // display.value=false
      }else{
        console.log('error update')
      }
    })
  }
 
  </script>
  