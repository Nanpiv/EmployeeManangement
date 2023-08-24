<template>
    <div>
        <q-list >
        <q-item>
          <q-item-section class="text-body1"> Notifications </q-item-section>
        </q-item>
        <q-separator />   
      </q-list>
      <q-table
      :rows=list
      :columns=columns

      >
      <template #body-cell-timestamp="props">
        <q-td :props="props">
          {{ convertDate(props.row.timestamp) }}
        </q-td>
      </template>

      </q-table>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

const columns=[
  {name:'empName',label:'Form',field:'empName',align:'left'},
  {name:'message',label:'Message',field:'message',align:'left' },
  {name:'timestamp',label:'Date',field:'timestamp',align:'left' },
  {name:'brachName',label:'Branch',field:'brachName',align:'left' }


]

const list=ref([])

const fetchNoti = () =>{
  const selector = {
    // createdBy: Meteor.userId(),
    to: Meteor.userId(),

  }

  Meteor.call('fetchNoti1',selector,(err,res)=>{
    if(!err){
      console.log('fetch noti success',res)
      list.value = res
    }else{
      console.log('fetch notutt error',err)
    }
  })
}

const convertDate=(date)=>{
  return moment(date).format('YYYY/MM/DD HH:mm A')
}

onMounted(()=>{
  fetchNoti()
})
</script>

<style scoped>
.message-text {
  font-size: 16px;
}
</style>