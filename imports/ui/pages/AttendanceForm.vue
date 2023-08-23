<template>
    <q-dialog
      v-model="visibleDialog"
      no-esc-dismiss
      no-backdrop-dismiss
      @hide="cancel()"
    >
      <q-card style="width: 70%; max-width: 80vw">
        <q-card-section>
          <div class="text-h6">Attendance</div>
        </q-card-section>
  
        <q-card-section>
          <validate-form ref="refForm" :validation-schema="rules">
            <q-form @submit.prevent>
              <div class="row q-col-gutter-x-xl q-col-gutter-y-md">
                <div class="col-xs-12 col-md-6 col-lg-6">
                  <div class="row q-col-gutter-y-sm">
                   
                    <div class="col-12">
                      <validate-field
                        v-slot="{ value, field, }"
                        v-model="form.employeeId"
                        name="employeeId"
                      >
                        <q-select
                          dense
                          outlined
                          :model-value="value"
                          label="Employee"
                          :options="employees"
                          v-bind="field"
                        
                          map-options
                          clearable
                          emit-value
                          option-value="_id"
                          option-label="name"
                        />
                       
                      </validate-field>
                    </div>
                    <div class="col-12">
                      <validate-field
                        v-slot="{ value, field }"
                        v-model="form.reason"
                        name="reason"
                      >
                        <q-input
                          :model-value="value"
                          outlined
                          dense
                          label="Reason "
                          v-bind="field"
                         
                        ></q-input>
                      </validate-field>
                    </div>
                  </div>
                </div>
  
                <div class="col-xs-12 col-md-6 col-lg-6">
                  <div class="row q-col-gutter-y-sm">
                 
                    <div class="col-12">
                      <validate-field
                        v-slot="{ value, field }"
                        v-model="form.type"
                        name="type"
                      >
                        <span class="text-grey-9" style="padding-right: 8px">
                          Type
                        </span>
  
                        <q-option-group
                          :model-value="value"
                          :options="statusOpts"
                          color="primary"
                          v-bind="field"
                          inline
                          style="display: inline-block"
                        />
                      </validate-field>
                    </div>

                    <div class="col-12">
                      <q-input
                      readonly
                      filled
                         
                      label="Date"
                      v-model="form.tranDate"
                       >
                      
                       <template v-slot:prepend>
                   <q-icon name="event" class="cursor-pointer">
                 <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.tranDate" mask="YYYY-MM-DD HH:mm" ></q-date>
                    </q-popup-proxy>
                   </q-icon>
                   </template>
                    <template v-slot:append>
                            <q-icon
                              name="access_time"
                              class="cursor-pointer"
                            
                            >
                              <q-popup-proxy
                                cover
                                transition-show="scale"
                                transition-hide="scale"
                              >
                                <q-time
                                  v-model="form.tranDate"
                                  mask="YYYY-MM-DD HH:mm"
                                >
                                  <div class="row items-center justify-end">
                                    <q-btn
                                      v-close-popup
                                      label="Close"
                                      color="primary"
                                      flat
                                    />
                                  </div>
                                </q-time>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
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
  import moment from 'moment'
  import { useStore } from '/imports/store'
  import Notify from '/imports/ui/lib/notify'
  import { ref, watch, onMounted, computed } from 'vue'
  import { useQuasar } from 'quasar'
  import { Form as ValidateForm, Field as ValidateField } from 'vee-validate'
  import { object, string, number, array, ref as yupRef } from 'yup'
  import { Meteor } from 'meteor/meteor'
  
const store =useStore()
const currentBranchId = computed(()=>store.getters['app/currentBranchId'])

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
  
  const initForm = {
    type: '',
    tranDate:new Date(),
    branchId: '',
    reason:'',
    employeeId:''
  }
  
  const statusOpts = [
    { label: 'Check In', value: 'checkIn' },
    { label: 'Check Out', value: 'checkOut' },
  ]
  // data properties
  const refForm = ref()
  const form = ref({ ...initForm })
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
  
  const checkExist = (selector) => {
    return new Promise((resolve, reject) => {
      Meteor.call('checkAttenExist', { selector }, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
  
  const submit = async () => {
    const { valid } = await refForm.value.validate()
  
    if (valid) {
      if (form.value._id) {
        update()
      } else {
        insert()
      }
    }
  }
  
  const insert = () => {
    form.value.branchId = currentBranchId.value
    const doc = { ...form.value };
    doc.tranDate=moment(form.value.tranDate).toDate()
    Meteor.call('insertAttendance', doc, (err, res) => {
      if (err) {
        console.log(err)
        Notify.error({ message: err.reason || err })
      } else {
        Notify.success({ message: 'Success' })
        cancel()
      }
    })
  }

  
  const update = () => {
    const doc = { ...form.value };
    doc.tranDate=moment(form.value.tranDate).toDate()
    Meteor.call('updateAttendance', doc, (err, res) => {
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
      message: `Do you want to remove [${form.value.type}] ?`,
      cancel: true,
      ok: {
        push: true,
      },
    }).onOk(() => {
      Meteor.call('removeAttendance', { id: props.showId }, (err, res) => {
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

  //call department
const employees=ref()
  const fetchEmployee=()=>{
    const query = { branchId:currentBranchId.value}
    Meteor.call('fetchEmployee',query,(err,res)=>{
      if(!err){
        employees.value=res
        // console.log('success',res)
      }else{
        console.log('fetch employees error')
      }
  })
  }
  
onMounted(() => {
    fetchEmployee()
}),

  watch(
    () => props.dialog,
    (value) => {
      visibleDialog.value = value
     
    }
  )
  
  watch(()=>currentBranchId.value,()=>{
    console.log(currentBranchId.value,)
    fetchEmployee()
  })
  watch(
    () => props.showId,
    (value) => {
      if (value) {
        Meteor.call('getAttendanceById', value, (err, res) => {
          form.value = res
          form.value.tranDate=moment(res.tranDate,).format('YYYY-MM-DD HH:mm');

        })
      }
    }
  )
  
  watch(
    ()=>visibleDialog.value,(value)=>{
      if(value==true){
        form.value.tranDate=moment(form.value.tranDate,).format('YYYY-MM-DD HH:mm');
      }
    }
  )
  </script>
  