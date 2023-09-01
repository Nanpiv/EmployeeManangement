<template>
   <q-card>
    <q-card-section>
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
          <q-btn color="primary" no-caps icon="add" @click.prevent="addNew"  v-if="$userIsInRole(['insertRoleGroup'])">
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
      <template #body-cell-name="props">
        <q-td :props="props">
          <span @click="edit(props.row)" class="ra-text-link">
            {{ props.row.name }}
          </span>
        </q-td>
      </template>
      <template #body-cell-roles="props">
        <q-td :props="props">
          {{ props.row.roles?'[...]':'' }}
        </q-td>
      </template>
     
    </q-table>
    </q-card-section>
    <GroupForm
      :dialog="visibleDialog"
      :show-id="showId"
      @closed="handleClosedDialog"
    />
   </q-card>
  </template>
  <script setup>
  import { onMounted, ref } from 'vue'
  import Notify from '/imports/ui/lib/notify'
  import GroupForm from './GroupForm.vue'
  
  const columns = [
    {
      name: 'name',
      label: 'Name',
      align: 'left',
      field: 'name',
    },
    { name: 'roles', label: 'Roles', field: 'roles', align: 'left', },
    // { name: 'status', label: 'Status', field: 'status', align: 'left', },
  ]
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
       
      ]
    }
    const match = {
      page,
      rowsPerPage,
      selector: query,
    }
    Meteor.call('getRoelGroups', { ...match }, (err, res) => {
      if (err) {
        console.log('error', err)
        Notify.error({ message: err.reason || err })
      } else {
        console.log(res)
        data.value = res
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
  </script>
  