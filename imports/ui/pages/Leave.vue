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
          <span @click="edit(props.row)" class="ra-text-link" v-if="props.row.status==='active' && Meteor.userId() !=='ZYDNrkxumdHah5G3i'">
            {{ props.row.employeeName }}
          </span>
          <span v-else>
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
            <!-- {{ toLocaleString('en-GB') }} -->
         
        </q-td>
      </template>
      <template #body-cell-reason="props">
        <q-td :props="props">
         
            {{ props.row.reason }}
         
        </q-td>
      </template>
      <template #body-cell-fromDate="props">
        <q-td :props="props">
         
          {{formatTime(props.row.fromDate )}}
         
        </q-td>
      </template>
      <template #body-cell-toDate="props">
        <q-td :props="props">
          {{ formatTime(props.row.toDate)}}
        </q-td>
      </template>
      <template #body-cell-acceptedBy="props">
        <q-td :props="props">
          {{props.row.acceptedBy}}
        </q-td>
      </template>
     
      <template #body-cell-action="props" v-if="Meteor.userId() == 'ZYDNrkxumdHah5G3i'">
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
      <template #body-cell-status="props" v-else >
        <q-td :props="props">{{ props.row.status }}</q-td>
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
  import { useQuasar } from 'quasar'
  import { subscribe, autorun } from 'vue-meteor-tracker'
// import Test from '/imports/api/test/test';
  import Leaves from '/imports/api/leaves/leaves';
import { useRoute } from 'vue-router'
//subcribe
const route =useRoute()
subscribe('alert')
const alert = autorun(() => Leaves.find({status:'active'}).fetch()).result
  // pagination
  const pagination = ref({
    sortBy: 'name',
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
  })

//datatable
  const columns = [
    { name: 'tranDate', label: 'Tran Date', field: 'tranDate',align:'left',},
    { name: 'employeeName', label: 'Employee', field: 'employeeName',align:'left'},
    { name: 'reason', label: 'Reason', field: 'reason',align:'left' },
    { name: 'type', label: 'Type', field: 'type',align:'left' },
    { name: 'fromDate', label: 'From Date', field: 'fromDate',align:'left' },
    { name: 'toDate', label: 'To Date', field: 'toDate',align:'left' },
    { name: 'acceptedBy', label: 'Accetped By', field: 'acceptedBy',align:'left' },
    // { name: 'branchName', label: 'Branch', field: 'branchName',align:'left' },
    { name: 'status', label: 'Status', field: 'status',align:'left' },
    { name: 'action', label: 'Action', field: 'action',align:'left' }
  ]


  //variable
  const users =ref([])
  const store =useStore()
  const currentBranchId = computed(()=>store.getters['app/currentBranchId'])
  const currentUser =computed(()=>store.getters['app/currentUserId'])
  const visibleDialog = ref(false)
  const loading = ref(false)
  const filter = ref('')
  const data = ref([])
  const showId = ref('')
  const $q = useQuasar()


  const notiform=ref({
  title: 'Alert',
    message:`${data.status} your request.`,
    icon: 'done',
    status:'active',
    type:"Approved",
    refId:'',
    createdBy:'',
    toCreatedBy:'',
    branchId:'',
    employeeId:'',
    to:'',
    timestamp:new Date()
})



//methods

  const addNew = () => {
    visibleDialog.value = true
  }
  //fromart time date
  const formatTime = (date) => {


return moment(date).format('YYYY/MM/DD HH:mm A')
}

//fetch leave
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
        console.log('fetch leaves success',res)
        data.value = res.data || []

   
        pagination.value.rowsNumber = res.total || 0
      }
  
      loading.value = false
    })
  }

  //pagination
  const onChangePagination = (val) => {
    pagination.value = val.pagination
    fetchData()
  }
  
  //edit leave
  const edit = (row) => {
    visibleDialog.value = true
    showId.value = row._id
  }
  //close dialog
  const handleClosedDialog = (value) => {
    visibleDialog.value = value
    showId.value = ''
    fetchData()
  }
  

  // update status
  const updateStatus = (item, status,acceptedById)=>{
    let sts = ''
    status === 'accepted'? sts= 'accept': sts = 'cancel'
    $q.dialog({
    title: 'Confirm',
    message: `Do you want to ${sts} this leave ?`,
    cancel: true,
    ok: {
      push: true,
    },
  })
    .onOk(() => {


      console.log('status', status);
    let _id = item._id
    Meteor.call('updateStatusAccepted', { _id,status,acceptedById,} ,(err,res)=>{
      if(!err){
        // console.log('sucess update status')
        fetchData()
        alert
      
      }else{
        console.log('error update')
      }
    })
    })
  }

  //fetch user
  const fetchUser =()=>{
    Meteor.call('fetchUser',(err,res)=>{
      if(!err){
        // console.log('user',res)
        users.value=res
      }else{
        console.log('user error',err)
      }
    })
  }



//onMounted

 // life cycle
 onMounted(() => {
    fetchData()
  })
  onMounted(()=>
 fetchUser()
 )
 

 //watch
  watch(()=>currentBranchId.value,()=>{
    console.log(currentBranchId.value,)
    fetchData()
  })
//   watch(()=>
//  data.value.acceptedById,()=>{
//     // if(!value) return false 

//     const doc = users.value.find(it=>it._id=value)
//     console.log('d',doc)
   
  

//   })

  </script>
  