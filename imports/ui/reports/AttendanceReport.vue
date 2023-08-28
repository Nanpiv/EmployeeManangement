<template>
    <div>
      <q-card class="my-card">
        <q-form class="q-gutter-md">
          <q-card-section>
            <div class="row q-col-gutter-x-md q-col-gutter-y-md">
              <div class="col-xs-12 col-md-6 col-lg-6">
                <q-input v-model="form.tranDate" filled mask="date" dense>
                  <template #append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="form.tranDate">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-xs-12 col-md-6 col-lg-6">
                <q-input
                  v-model="form.name"
                  filled
                  mask="date"
                  dense
                  placeholder="Name..."
                >
                </q-input>
              </div>
            </div>
          </q-card-section>
          <div class="text-right q-pb-md q-pr-md">
            <q-btn label="Submit" color="primary" />
          </div>
        </q-form>
      </q-card>
      <ReportLayoutVue
        :exec-time="execTime"
        :report-title="`Testing`"
        :paper-size="paperSize"
        :css-text="cssText"
        :columns="columns"
        :active-columns="checkedColumns"
        @changeColumn="changeColumn"
      >
        <!--REPORT HEADER-->
        <template #header>
          <div class="report-name">
            {{ reportName }}
          </div>
        </template>
  
        <!--REPORT FILTER-->
        <template #filter>
          <div class="row">
            <div class="col colspan-8">
              <span class="title"> Name : </span>
              [All]
              <div class="ra-mt-sm" />
            </div>
            <div class="col colspan-8">
              <span class="title"> Type : </span>
              [All]
              <div class="ra-mt-sm" />
            </div>
            <div class="col colspan-8">
              <span class="title"> Date: </span>
              [All]
              <div class="ra-mt-sm" />
            </div>
           
          </div>
        </template>
  
        <!--REPORT CONTENT-->
        <div>
          <table id="myTable" class="table-content">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Type</th>
                <th>Date</th>
                <!-- <th v-if="showMoreHeader('type')">Type</th>
                <th v-if="showMoreHeader('address')">Date</th> -->
                <th>Reason</th>
                <th>Branch CheckIn/CheckOut</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(doc, index) in reportData" :key="index">
                <td>{{ index + 1 }}</td>
                <td>
                  <span class="ra-text-link">
                    {{ doc.employeeName }}
                  </span>
                </td>
                <td>{{ doc.type }}</td>
                <td >{{ formatDate(doc.tranDate) }}</td>
                <td>{{ doc.reason }}</td>
                <td v-if="doc.type==='checkIn'">{{ formatTime(doc.checkIn) }}</td>
                <td v-else>{{ formatTime(doc.checkOut) }}</td>

                <td v-if="doc.type==='checkIn'">{{ doc.checkIn.toLocaleTimeString()<=doc.tranDate.toLocaleTimeString()?'Late':'Good' }}</td>
                <td v-else>{{ doc.checkOut.toLocaleTimeString() <= doc.tranDate.toLocaleTimeString()?'Good':'Bad' }}</td>

                <!-- <td v-if="showMoreHeader('address')">{{ doc.address }}</td> -->
              </tr>
            </tbody>
          </table>
        </div>
      </ReportLayoutVue>
    </div>
  </template>
  <script setup>

  import { includes } from 'lodash'
  import { ref,watch,computed, onMounted } from 'vue'
  import ReportLayoutVue from '../layouts/ReportLayout.vue'
  import { Meteor } from 'meteor/meteor'
  import { useStore } from '/imports/store'
  import moment from 'moment'


  const store = useStore()

  const currentBranchId =computed(()=>store.getters['app/currentBranchId'])
  const execTime = ref(0)
  const paperSize = ref('a4-p')
  const reportName = ref('Attendance Report')
  const columns = ref([
    { label: 'Date', value: 'tranDate' },
    { label: 'Type', value: 'type' },
    { label: 'Reason', value: 'reason' },

  ])
  const checkedColumns = ref(['gender', 'address'])
  const reportData = ref([
    //date
  ])
  const cssText = ref(``)
  const form = ref({
    name: '',
    tranDate: moment(new Date()).format('YYYY/MM/DD'),
  })
  //method
  const changeColumn = (val) => {
    checkedColumns.value = val
  }
  const showMoreHeader = (field) => {
    return includes(checkedColumns.value, field)
  }

//fetch date
  const fetchAttendances =()=>{
    const query = { branchId:currentBranchId.value}
    Meteor.call('fetchAttendances',query,(err,res)=>{
      if(!err){
        reportData.value=res
        console.log('success',res)
        // if (reportData.value.checkIn.getHours() === reportData.value.tranDate.getTime()) {
        //                console.log('The dates are equal')
        //             } else if (reportData.value.checkIn.getTime() > reportData.value.tranDate.getTime()) {
        //                 console.log('Good')
        //             } else {
        //                 console.log('Late')
        //             }

      }else{
        console.log('fetch employees error')
      }
  })

  }


    //fromart time date
 const formatDate = (date) => {
return moment(date).format('YYYY/MM/DD hh:mm A')
}
const formatTime = (date) => {
return moment(date).format('hh:mm A')
}

watch(()=>currentBranchId.value,()=>{
   
    fetchAttendances()
  })

  onMounted(()=>
  fetchAttendances()
  )


  </script>
  <style lang="scss" scoped>
  @import './imports/ui/styles/report.scss';
  </style>
  