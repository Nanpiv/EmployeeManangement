<template>
  <q-dialog v-model="visibleDialog" no-esc-dismiss no-backdrop-dismiss @hide="cancel()">
    <q-card style="width: 70%; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">EmployeeTypes</div>
      </q-card-section>

      <q-card-section>
        <validate-form ref="formRef" :validation-schema="rules">
          <q-form @submit.prevent>
            <div class="row q-col-gutter-x-xl q-col-gutter-y-md">
              <div class="col-xs-12 col-md-6 col-lg-6">
                <div class="row q-col-gutter-y-sm">
                  <div class="col-12">
                    <validate-field v-slot="{ value, field, errorMessage }" v-model="form.name" name="name">
                      <q-input :model-value="value" outlined dense label="Name *" v-bind="field" :error="!!errorMessage"
                        :error-message="errorMessage"></q-input>
                    </validate-field>
                  </div>
                </div>
              </div>
              <div class="col-xs-12 col-md-6 col-lg-6">
                <div class="row q-col-gutter-y-sm">
                  <!-- field status -->
                  <div class="col-12">
                    <validate-field v-slot="{ value, field }" v-model="form.status" name="status">
                      <span class="text-grey-9" style="padding-right: 8px">
                        Status
                      </span>
                      <q-option-group :model-value="value" :options="statusOpts" color="primary" v-bind="field" inline
                        style="display: inline-block" />
                    </validate-field>
                  </div>
                </div>
              </div>
            </div>
          </q-form>
        </validate-form>
      </q-card-section>
      <!-- section button -->
      <q-card-actions align="right" class="bg-white text-teal">
        <div class="text-right q-gutter-sm">
          <q-btn v-if="$userIsInRole('insertEmployeeType') && !showId" color="primary" @click="submit"> Save </q-btn>
          <q-btn v-if="$userIsInRole('updateEmployeeType') && showId" color="primary" @click="submit"> Save </q-btn>
          <q-btn v-if="showId && $userIsInRole('removeEmployeeType')" color="red" @click="remove"> Remove </q-btn>
          <q-btn outline color="primary" @click="cancel"> Cancel </q-btn>
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'ComB',
}
</script>
  
<script setup>
import { useStore } from '/imports/store'
import Notify from '/imports/ui/lib/notify'
import { ref, watch, computed } from 'vue'
import { useQuasar } from 'quasar'
import { Form as ValidateForm, Field as ValidateField } from 'vee-validate'
import { object, string, number, array, ref as yupRef } from 'yup'
import { Meteor } from 'meteor/meteor'

const store = useStore()
const currentBranchId = computed(() => store.getters['app/currentBranchId'])//call currentbranchId from vue
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

const initForm =()=>{
  return  {
  name: '',
  branchId: '',
  status: 'active',
}
}
const statusOpts = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]
// data properties
const formRef = ref(null)
const form = ref(initForm())
const visibleDialog = ref(false)

const rules = object({
  // name:string().required()
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

const checkExist = (selector) => {
  return new Promise((resolve, reject) => {
    Meteor.call('checkEmployeeTypeExist', { selector }, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

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

const insert = () => {
  form.value.branchId = currentBranchId.value
  Meteor.call('insertEmployeeType', form.value, (err, res) => {
    if (err) {
      console.log(err)
      Notify.error({ message: err.reason || err })
    } else {
      Notify.success({ message: 'Success' })
      reset()
    }
  })
}


const update = () => {
  Meteor.call('updateEmployeeType', form.value, (err, res) => {
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
    message: `Do you want to remove [${form.value.name}] ?`,
    cancel: true,
    ok: {
      push: true,
    },
  }).onOk(() => {
    Meteor.call('removeEmployeeType', { id: props.showId }, (err, res) => {
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
  form.value = initForm()
}

// cancel
const cancel = () => {
  reset()
  emit('closed', false)
}

watch(
  () => props.dialog,
  (value) => {
    visibleDialog.value = value
  }
)

watch(
  () => props.showId,
  (value) => {
    if (value) {
      Meteor.call('getEmployeeTypeById', value, (err, res) => {
        // form.value.branchId = currentBranchId.value
        form.value = res
      })
    }
  }
)
</script>
  