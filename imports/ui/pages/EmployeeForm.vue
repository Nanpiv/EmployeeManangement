<template>
  <q-dialog v-model="visibleDialog" no-esc-dismiss no-backdrop-dismiss @hide="cancel()">
    <q-card style="width: 70%; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Employees</div>
      </q-card-section>

      <q-card-section>
        <validate-form   ref="formRef" :validation-schema="rules">
          <q-form @submit.prevent>
            <div class="row q-col-gutter-x-xl q-col-gutter-y-md">
              <div class="col-xs-12 col-md-6 col-lg-6">
                <div class="row q-col-gutter-y-sm">
                    <!-- field employee name -->
                  <div class="col-12">
                    <validate-field v-slot="{ value, field, errorMessage }" v-model="form.name" name="name">
                      <q-input :model-value="value" outlined dense label="Name *" v-bind="field" :error="!!errorMessage"
                        :error-message="errorMessage"></q-input>
                    </validate-field>
                  </div>
                    <!-- field typeid -->
                  <div class="col-12">
                    <validate-field v-slot="{ value, field, }" v-model="form.typeId" name="typeId">
                      <q-select dense outlined :model-value="value" label="Type" :options="employeetype" v-bind="field"
                        map-options clearable emit-value option-value="_id" option-label="name" />

                    </validate-field>
                  </div>
                    <!-- field position -->
                  <div class="col-12">
                    <validate-field v-slot="{ value, field, }" v-model="form.positionId" name="positionId">
                      <q-select dense outlined :model-value="value" label="Position" :options="positions" v-bind="field"
                        map-options clearable emit-value option-value="_id" option-label="name" />

                    </validate-field>
                  </div>
                    <!-- field address -->
                  <div class="col-12">
                    <validate-field v-slot="{ value, field, }" v-model="form.address" name="address">
                      <q-input :model-value="value" outlined dense label="Address " v-bind="field"></q-input>
                    </validate-field>
                  </div>
                    <!-- field telephone -->
                  <div class="col-12">
                    <validate-field v-slot="{ value, field }" v-model="form.telephone" name="telephone">
                      <q-input :model-value="value" outlined dense label="Telephone *" v-bind="field"></q-input>
                    </validate-field>
                  </div>

                </div>
              </div>

              <div class="col-xs-12 col-md-6 col-lg-6">
                <div class=" q-col-gutter-y-sm">
                    <!-- field startdate-->
                  <div class="col-xs-6 col-md-6 col-lg-6">

                    <q-input readonly filled label="Start Date" v-model="form.startDate">

                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy transition-show="scale" transition-hide="scale">
                            <q-date v-model="form.startDate"></q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <!-- field checkin -->
                  <div class="col-xs-6 col-md-6 col-lg-6">
                    <q-input filled class="w-full" v-model="form.checkIn" readonly label="Check In">
                      <!-- :rules="['time']" -->
                      <!-- mask="time" -->
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="form.checkIn" mask="HH:mm">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <!-- field checkout -->
                  <div class="col-xs-6 col-md-6 col-lg-6">
                    <q-input filled class="w-full" v-model="form.checkOut" readonly label="Check Out">
                      <!-- :rules="['time']" -->
                      <!-- mask="time" -->
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="form.checkOut" mask="HH:mm">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <!-- field token -->
                  <div class="col-12">
                    <validate-field v-slot="{ value, field, }" v-model="form.token" name="token">
                      <q-input :model-value="value" outlined dense label="Token " v-bind="field"></q-input>
                    </validate-field>
                  </div>
                </div>
              </div>
            </div>
          </q-form>
        </validate-form>
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-teal">
        <div class="text-right q-gutter-sm">
          <q-btn v-if="$userIsInRole(['insertEmployee']) && !showId" color="primary" @click="submit"> Save </q-btn>
          <q-btn v-if="$userIsInRole(['updateEmployee']) && showId" color="primary" @click="submit"> Save </q-btn>
          <q-btn v-if="showId && $userIsInRole('removeEmployee')" color="red" @click="remove"> Remove </q-btn>
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
import moment from "moment";
import { useStore } from '/imports/store'
import Notify from '/imports/ui/lib/notify'
import { ref, watch, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { Form as ValidateForm, Field as ValidateField } from 'vee-validate'
import { object, string, number, array, ref as yupRef } from 'yup'
import { Meteor } from 'meteor/meteor'

// variable
const store = useStore()
const currentBranchId = computed(() => store.getters['app/currentBranchId'])
const formRef = ref(null)
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

const emits = defineEmits(['closed'])

const initForm = ()=>{
  return {
  name: '',
  typeId: '',
  positionId: '',
  address: '',
  telephone: '',
  startDate: moment(new Date()).format('YYYY/MM/DD'),
  checkIn: '',
  checkOut: '',
  branchId: '',
  token: '',
}
}
const statusOpts = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]

const form = ref(initForm())

const visibleDialog = ref(false)

const rules = object({
  name: string()
    .min(4)
    .test('exist', 'Name is required', (value) => {
      if (!value) return true

      let selector = {
        // name: {
        //   // $regex: new RegExp('^' + value.replace(/%/g, '.*') + '$', 'i'),
        //   $regex: new RegExp(value, 'i'),
        // },
        branchId: currentBranchId.value,
        name: value,
      }
      if (props.showId) {
        selector._id = { $ne: props.showId }
      }

      return checkExist(selector)
        .then((res) => {
          return !res
        })
        .catch(() => false)
    }),
})

//----method----

//check exist name employee
const checkExist = (selector) => {
  return new Promise((resolve, reject) => {
    Meteor.call('checkEmployeeExist', { selector }, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}


//  submit  

const submit = async () => {
  const { valid } = await formRef.value.validate()

  if (valid) {
    if (form.value._id) {
      update()
    } else {
      insert()
    }
  }
}
//convert time
const convertTime = (strTime) => {
  const selectedDateTime = moment();
  const strSplite = strTime.split(":"); // 08:36 => ['08',' 36']
  selectedDateTime.hour(strSplite[0]);
  selectedDateTime.minutes(strSplite[1]);

  return selectedDateTime.toDate();
};

//insert employee
const insert = () => {

  form.value.branchId = currentBranchId.value
  const doc = { ...form.value };
  doc.checkIn = convertTime(form.value.checkIn);
  doc.checkOut = convertTime(form.value.checkOut);
  doc.startDate = moment(form.value.startDate).toDate()
  Meteor.call('insertEmployee', doc, (err, res) => {
    if (err) {
      console.log(err)
      Notify.error({ message: err.reason || err })
    } else {
      Notify.success({ message: 'Success' })
      reset()
    }
  })
}

// update employee
const update = () => {
  const doc = { ...form.value };
  doc.checkIn = convertTime(form.value.checkIn);
  doc.checkOut = convertTime(form.value.checkOut);
  doc.startDate = moment(form.value.startDate).toDate()

  Meteor.call('updateEmployee', doc, (err, res) => {
    if (err) {
      Notify.error({ message: err.reason || err })
    } else {

      Notify.success({ message: 'Success' })
      cancel()
    }
  })
}

//remove employee
const remove = () => {
  $q.dialog({
    title: 'Confirm',
    message: `Do you want to remove [${form.value.name}] ?`,
    cancel: true,
    ok: {
      push: true,
    },
  }).onOk(() => {
    Meteor.call('removeEmployee', { id: props.showId }, (err, res) => {
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
  formRef.value?.resetForm()
  // form.value = initForm()
  form.value.name =''
  form.value.token=''
  form.value.employeetype=''
  form.value.positionId=''
  form.value.address=''
  form.value.telephone=''
}

const cancel = () => {
  emits('closed',false)
  reset()
}

//call department
const positions = ref()
const fetchPosition = () => {
  const query = { branchId: currentBranchId.value }
  Meteor.call('fetchPosition', query, (err, res) => {
    if (!err) {
      positions.value = res
      // console.log('success', res)
    } else {
      console.log('fetch position error')
    }
  })
}

//call employeetype
const employeetype = ref()
const fetchEmployeeType = () => {
  const query = { branchId: currentBranchId.value }

  Meteor.call('fetchEmployeeType', query, (err, res) => {
    if (!err) {
      employeetype.value = res
      // console.log('success', res)
    } else {
      console.log('fetch employeetype error')
    }
  })
}

//fecth branch 
const branches = ref()
const getBranch = () => {
  const query = { _id: currentBranchId.value }

  Meteor.call('fetchBranches', query, (err, res) => {
    if (!err) {
      branches.value = res
      // console.log('branch', res)
    } else {
      console.log('fetch branch error')
    }
  })
}
// -----onMounted-------
onMounted(() => {
  fetchEmployeeType()
  fetchPosition()
  getBranch()
}),

  //-----watch-----
  watch(
    () => props.dialog,
    (value) => {
      visibleDialog.value = value
    }
  )

watch(() => currentBranchId.value, () => {
  // console.log(currentBranchId.value,)
  fetchEmployeeType()
  fetchPosition()
  getBranch()
})

//format date when edit
watch(
  () => props.showId,
  (value) => {
    if (value) {
      Meteor.call('getEmployeeById', value, (err, res) => {
        form.value = res
        form.value.startDate = res.startDate.toLocaleDateString('zh-Hans-CN')

        form.value.checkIn = moment(res.checkIn, "HH:mm").format("HH:mm");
        form.value.checkOut = moment(res.checkOut, "HH:mm").format("HH:mm");
        // console.log('edit', res)
      })
    }
  }
)

// format date when open dialog
watch(() =>
  visibleDialog.value, (value) => {
    if (!value) return false

    const doc = branches.value.find(it => it._id = value)
    // console.log(doc)
    form.value.branchId = currentBranchId.value
    form.value.checkIn = moment(doc.checkIn, "HH:mm").format("HH:mm");
    form.value.checkOut = moment(doc.checkOut, "HH:mm").format("HH:mm");

    // console.log(form.value.branchId)

  })


watch(
  () => visibleDialog.value, (value) => {
    if (value == true) {
      form.value.startDate = moment(form.value.startDate,).format('YYYY/MM/DD');

    }
  }
)
// watch(()=>reset(),(value)=>{
//   const doc = branches.value.find(it => it._id = value)
//     // console.log(doc)
//     form.value.branchId = currentBranchId.value
//     form.value.checkIn = moment(doc.checkIn, "HH:mm").format("HH:mm");
//     form.value.checkOut = moment(doc.checkOut, "HH:mm").format("HH:mm");
// })
</script>
  