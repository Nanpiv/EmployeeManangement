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
      <template #body-cell-name="props">
        <q-td :props="props">
          <span @click="edit(props.row)" class="ra-text-link">
            {{ props.row.name }}
          </span>
        </q-td>
      </template>
      <template #body-cell-checkIn="props">
        <q-td :props="props">
          
            {{ props.row.checkIn }}
         
        </q-td>
      </template>
      <template #body-cell-checkOut="props">
        <q-td :props="props">
          
            {{ props.row.checkOut }}
         
        </q-td>
      </template>
    </q-table>
    <input type='date' v-model='myDate'>
    <br>
    {{myDate}}
    {{ kDate }}
  
    <BranchForm
      :dialog="visibleDialog"
      :show-id="showId"
      @closed="handleClosedDialog"
    />
  </template>
  <script setup>
  import { onMounted, ref } from 'vue'
  import Notify from '/imports/ui/lib/notify'
 import BranchForm from './BranchForm.vue';
  
  const columns = [
    {
      name: 'name',
      label: 'Name',
      align: 'left',
      field: 'name',
    },
    
    { name: 'address', label: 'Address', field: 'address' },
    { name: 'checkIn', label: 'CheckIn', field: 'checkIn' },
    { name: 'checkOut', label: 'CheckOut', field: 'checkOut' },
  ]
 let myDate = new Date().toISOString().slice(11,16)

 
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
  
  // method
  const fetchData = () => {
    loading.value = true
    const { page, rowsPerPage } = pagination.value
    let exp = new RegExp(filter.value)
    const query = {}
    if (filter.value) {
      query['$or'] = [
        { name: { $regex: exp, $options: 'i' } },
        { address: { $regex: exp, $options: 'i' } },
        { checkIn: { $regex: exp, $options: 'i' } },
        { checkOut: { $regex: exp, $options: 'i' } },

      ]
    }
    const match = {
      page,
      rowsPerPage,
      selector: query,
    }
    Meteor.call('findBranches', { ...match }, (err, res) => {
      if (err) {
        console.log('error', err)
        Notify.error({ message: err.reason || err })
      } else {
        // this.list = res
        
        data.value = res.data || []
        console.log(res.data)
        pagination.value.rowsNumber = res.total || 0
        
      }
  
      loading.value = false
    })
  }
  //  let hoursMin = data.value.checkIn.getHours()+':'+data.value.checkIn.getMinutes()
  // console.log(hoursMin)
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
  </script>
  