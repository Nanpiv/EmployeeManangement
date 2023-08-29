<template>
  <q-dialog v-model="visibleDialog" no-esc-dismiss no-backdrop-dismiss @hide="cancel()">
    <q-card style="width: 70%; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Leave</div>
      </q-card-section>

      <q-card-section>
        <validate-form ref="refForm" :validation-schema="rules">
          <q-form @submit.prevent>
            <div class="row q-col-gutter-x-xl q-col-gutter-y-md">
              <div class="col-xs-12 col-md-6 col-lg-6">
                <div class="row q-col-gutter-y-sm">

                  <div class="col-12">
                    <validate-field v-slot="{ value, field, }" v-model="form.employeeId" name="employeeId">
                      <q-select dense outlined :model-value="value" label="Employee" :options="employees" v-bind="field"
                        map-options clearable emit-value option-value="_id" option-label="name" />

                    </validate-field>
                  </div>
                  <div class="col-12">
                    <validate-field v-slot="{ value, field }" v-model="form.reason" name="reason">
                      <q-input :model-value="value" outlined dense label="Reason " v-bind="field"></q-input>
                    </validate-field>
                  </div>
                  <div class="col-12">
                    <validate-field v-slot="{ value, field, }" v-model="form.type" name="type">
                      <q-select dense outlined :model-value="value" label="Type" :options="typeOpts" v-bind="field" />

                    </validate-field>
                  </div>
                </div>
              </div>

              <div class="col-xs-12 col-md-6 col-lg-6">
                <div class="row q-col-gutter-y-sm">
                  <!-- from date -->
                  <div class="col-12">
                    <q-input readonly filled label="From Date" v-model="form.fromDate">
                      <template v-slot:prepend>
                        <q-icon :name="form.type=='Full' ? 'event' : 'access_time'" class="cursor-pointer">
                          <q-popup-proxy transition-show="scale" transition-hide="scale" >
                            <q-date v-if="form.type=='Full'" v-model="form.fromDate" color="orange" text-color="white"
                              bordered>
                            </q-date>

                              <q-time v-else v-model="form.fromDate" :mask="mask" >
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>

                      <!-- <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer" v-show="display">
                          <q-popup-proxy transition-show="scale" transition-hide="scale">
                            <q-date v-model="form.fromDate" color="orange" text-color="white" bordered></q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                      <template v-if="form.type === 'Time'" v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer" v-show="displayTime">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale" v-show="displayDateIcon">
                            <q-time v-model="form.fromDate" mask="YYYY/MM/DD HH:mm"  >
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                      <template v-else v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer" v-show="displayTime">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale" v-show="displayDateIcon">
                            <q-time v-model="form.fromDate" mask="YYYY/MM/DD HH:mm" >
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template> -->
                    </q-input>

                  </div>
                  <!-- to date -->
                  <div class="col-12">
                    <q-input readonly filled label="To Date" v-model="form.toDate">


                      <!-- <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer" v-show="display">
                          <q-popup-proxy transition-show="scale" transition-hide="scale" v-show="displayDateIcon">
                            <q-date v-model="form.toDate" :options="minDate" color="orange" text-color="white"
                              bordered></q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template> -->

                      <template v-slot:prepend>
                        <q-icon :name="form.type=='Full' ? 'event' : 'access_time'" class="cursor-pointer" >
                          <q-popup-proxy transition-show="scale" transition-hide="scale" >
                            <q-date v-if="form.type=='Full'" v-model="form.toDate" :options="minDate" color="orange" text-color="white"
                              bordered>
                            </q-date>

                              <q-time v-else v-model="form.toDate" :mask="mask" >
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                      <!-- <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer" v-show="displayTime">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                              <q-time v-model="form.toDate" :mask="mask" >
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                      </template> -->
                      <!-- <template v-if="form.type === 'Time'" v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer" v-show="displayTime">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="form.toDate" mask="YYYY/MM/DD hh:mm"  >
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                      <template v-else v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer" v-show="displayTime">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="form.toDate" mask="YYYY/MM/DD hh:mm" >
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template> -->
                    </q-input>
                  </div>
                </div>
              </div>
            </div>
          </q-form>
        </validate-form>
       
      </q-card-section>
      <q-card-actions align="right" class="bg-white text-teal">
        <div class="text-right q-gutter-sm">
          <q-btn color="primary" @click="submit"> Save </q-btn>
          <q-btn v-if="showId" color="red" @click="remove"> Remove </q-btn>
          <q-btn outline color="primary" @click="cancel"> Cancel </q-btn>
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'ComA',
}
</script>
  
<script setup>
import { subscribe, autorun } from 'vue-meteor-tracker'
import { useStore } from '/imports/store'
import Notify from '/imports/ui/lib/notify'
import { ref, watch, onMounted, computed, nextTick, readonly } from 'vue'
import { useQuasar } from 'quasar'
import { Form as ValidateForm, Field as ValidateField } from 'vee-validate'
import { object, string, number, array, ref as yupRef } from 'yup'
import { Meteor } from 'meteor/meteor'
import moment from 'moment'


//variable
const store = useStore()
const currentBranchId = computed(() => store.getters['app/currentBranchId'])
const currentUser = computed(() => store.getters['app/currentUserId'])
const $q = useQuasar()
const props = defineProps({
  dialog: {
    type: Boolean,
    default: true,
  },
  showId: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['closed'])
const mask = ref('YYYY/MM/DD')
const initForm = {
  type: 'Full',
  tranDate: new Date(),
  employeeId: '',
  status: 'active',
  reason: '',
  acceptedById: '',
  fromDate: moment().format('YYYY/MM/DD'),
  toDate: moment().add(1,'d').format('YYYY/MM/DD'),
  branchId: '',
}

const typeOpts = ref(
  [
    'Full',
    'Morning',
    'Afternoon',
    'Time'
  ]
)

const displayDateIcon = ref(true)

const display = ref(true)
const displayTime = ref(true)
// data properties
const refForm = ref()
const firstShowForm = ref(false)
const form = ref({ ...initForm })
const visibleDialog = ref(false)

const convertDateTime = (strTime) => {
const curr = moment()
const splitStrTime = strTime.split(':')

 curr.hours(splitStrTime[0])
 curr.minutes(splitStrTime[1])

 return curr.toDate()
}

//method

const submit = async () => {
  const { valid } = await refForm.value.validate()

  if (valid) {
    // if (form.value._id) {
    //   update()
    // } else {
      insert()
    // }
  }
}
const insert = () => {
  form.value.branchId = currentBranchId.value
  const doc = { ...form.value };

  doc.fromDate = moment(form.value.fromDate).toDate()
  doc.toDate = moment(form.value.toDate).toDate()

  if(form.value.type==='Time'){
    doc.fromDate = convertDateTime(form.value.fromDate)
  doc.toDate = convertDateTime(form.value.toDate)
  }

  let methodName = 'insertLeave'
  if(form.value._id) methodName = 'updateLeave'

  Meteor.call(methodName, doc, (err, res) => {
    if (err) {
      console.log(err)
      Notify.error({ message: err.reason || err })
    } else {
      Notify.success({ message: 'Success' })
      console.log('notica', res)
      cancel()
    }
  })
}


const update = () => {
  const doc = { ...form.value };
  doc.fromDate = moment(form.value.fromDate).toDate()
  doc.toDate = moment(form.value.toDate).toDate()
  Meteor.call('updateLeave', doc, (err, res) => {
    if (err) {
      Notify.error({ message: err.reason || err })
    } else {
      Notify.success({ message: 'Success' })
      cancel()
    }
  })
}

//remove
const remove = () => {
  $q.dialog({
    title: 'Confirm',
    message: `Do you want to remove this leave ?`,
    cancel: true,
    ok: {
      push: true,
    },
  }).onOk(() => {
    Meteor.call('removeLeave', { id: props.showId }, (err, res) => {
      if (err) {
        Notify.error({ message: err.reason || err })
      } else {
        Notify.success({ message: 'Success' })
        cancel()
      }
    })
    //
  })
}
const reset = () => {
  // refForm.value.resetValidation()
  // refForm.value.reset()
  // console.log(refForm.value)
  delete form.value._id
  form.value = { ...initForm }
}

// cancel
const cancel = () => {
  reset()
  emit('closed', false)
}

//formate disable date
const minDate = (date) => {
  const validate=ref();
  const today = moment(form.value.fromDate,).format("YYYY/MM/DD");
  
  if(form.value.type === 'Full'){
    validate.value= date > today
  }else{
    validate.value =date<= today
  }
  return validate.value
}


//call department
const employees = ref()
const fetchEmployee = () => {
  const query = { branchId: currentBranchId.value }
  Meteor.call('fetchEmployee', query, (err, res) => {
    if (!err) {
      employees.value = res
      // console.log('success',res)
    } else {
      console.log('fetch employees error')
    }
  })
}

onMounted(() => {
  fetchEmployee()
}),



//watch

  watch(
    () => props.dialog,
    (value) => {
      visibleDialog.value = value
    }
  )
// watch filter employ by branch
watch(() => currentBranchId.value, () => {
  // console.log(currentBranchId.value,)
  fetchEmployee()
})
//watch when have showid
watch(
  () => props.showId,
  (value) => {
    if (value) {
      // firstShowForm.value = true
      Meteor.call('getLeaveById', value, (err, res) => {
        form.value = {...res}
     
          form.value.toDate = moment(res.toDate,).format('YYYY/MM/DD');
          form.value.fromDate = moment(res.fromDate).format('YYYY/MM/DD');
         
        
        if(res.type=='Time') {
          form.value.toDate = moment(res.toDate,).format("HH:mm");
          form.value.fromDate = moment(res.fromDate,).format("HH:mm");
         
        } 

        console.log('form',form.value,res)

        nextTick(()=>{
          firstShowForm.value = false
        })
       
      })
    }
  }
)
//watch when open dialog
// watch(
//   () => visibleDialog.value, (value) => {
//     if (value == true) {
//       form.value.toDate = moment(form.value.toDate,).format('YYYY/MM/DD HH:mm');
//       form.value.fromDate = moment(form.value.fromDate,).format('YYYY/MM/DD HH:mm');
//     }
//   }
// )
//watch when select type
watch(() => form.value.type, (val) => {
  mask.value = 'YYYY/MM/DD'
  if(val=='Time') mask.value = 'HH:mm'

  if(firstShowForm.value) return false;
  
  form.value.toDate = moment().format("YYYY/MM/DD");
  form.value.fromDate = moment().format("YYYY/MM/DD");

  if(val== 'Full'){
    
    form.value.fromDate = moment(new Date()).add(1,'d').format("YYYY/MM/DD");
    form.value.fromDate = moment().format("YYYY/MM/DD");
  }else if

  (val=='Time'){
    form.value.fromDate = moment(new Date(),).format("HH:mm");
    form.value.toDate = moment(new Date(),).format("HH:mm");
    
  }
  else{
    mask.value="YYYY/MM/DD HH:mm"
    form.value.fromDate = moment(new Date(),).format("YYYY/MM/DD HH:mm");
    form.value.toDate = moment(new Date(),).format("YYYY/MM/DD HH:mm");
  }
  // else{
  // form.value.toDate = moment().format("YYYY/MM/DD HH:mm");
  // form.value.fromDate = moment().format("YYYY/MM/DD HH:mm");

  // }
  
// if(!props.showId){
//   if (form.value.type === 'Full') {
//     let today =new Date()
//     form.value.toDate = moment(today,).add(1,'d').format("YYYY/MM/DD");
//     // form.value.toDate = moment(new Date(),).format('YYYY/MM/DD');
//     form.value.fromDate = moment(new Date(),).format('YYYY/MM/DD');
//     displayTime.value = false
//     display.value = true
//   }
//   else  {
//     form.value.toDate = moment(new Date(),).format("YYYY/MM/DD HH:mm");
//     form.value.fromDate = moment(new Date(),).format("YYYY/MM/DD HH:mm");
//     displayDateIcon.value = false

//     displayTime.value = true
//     display.value = false
//   } 
// }
}

)

</script>
  