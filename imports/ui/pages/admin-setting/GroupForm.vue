<template>
  <q-dialog v-model="visibleDialog" no-esc-dismiss no-backdrop-dismiss @hide="cancel()">
    <q-card style="width: 70%; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Group</div>
      </q-card-section>
      <q-card-section>
        <validate-form ref="refForm" :validation-schema="rules">
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
              <div style="width: 100%;">
                <q-tabs v-model="tab" align="left" dense class="text-black" active-color="primary"
                  indicator-color="primary" narrow-indicator>
                  <q-tab v-for="(item, index) in data" :key="index" :name="item._id" :label="item._id" />
                </q-tabs>
                <q-separator />
                <q-tab-panels v-for="(item, index) in data" :key="index" v-model="tab">
                  <q-tab-panel :name="item._id">
                    <template v-for="(i, key) in item.details" :key="key">
                      <fieldset>
                        <legend>{{ i.title }}</legend>
                        <div class="q-pa-md ">
                          <div class="  text-black">
                            <div class=" row " style="font-size: medium;">
                              <template v-for="(it, key) in i.list" :key="key">
                                <div class="col-4">
                                  <q-checkbox v-model="form.roles" :val="it.name" color="primary">{{
                                    startCast(it.name) }}</q-checkbox>
                                </div>
                              </template>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </template>
                  </q-tab-panel>
                </q-tab-panels>
              </div>
            </div>
          </q-form>
        </validate-form>
      </q-card-section>
      <q-card-actions align="right" class="bg-white text-teal">
        <div class="text-right q-gutter-sm">
          <q-btn color="primary" @click="submit" v-if="$userIsInRole(['insertRoleGroup']) && !showId"> Save </q-btn>
          <q-btn color="primary" @click="submit" v-else-if="$userIsInRole(['updateRoleGroup']) && showId"> Save </q-btn>
          <q-btn v-if="showId && $userIsInRole('removeRoleGroup')" color="red" @click="remove"> Remove </q-btn>
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
import Notify from '/imports/ui/lib/notify'
import { ref, watch, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { Form as ValidateForm, Field as ValidateField } from 'vee-validate'
import { object, string, number, array, ref as yupRef } from 'yup'
import { Meteor } from 'meteor/meteor'
import lodash_ from 'lodash'
const tab = ref('Admin')
const check = ref([])
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

const initForm = ()=>{
  return {
  name: '',
  roles: [],
}
}

// data properties
const refForm = ref(null)
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
    Meteor.call('checkRoleGroupExist', { selector }, (err, res) => {
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
  Meteor.call('insertRoleGroup', form.value, (err, res) => {
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
  Meteor.call('updateRoleGroup', form.value, (err, res) => {
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
    Meteor.call('removeRoleGroupById', { id: props.showId }, (err, res) => {
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
  
  refForm.value?.resetForm()
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
      Meteor.call('getRoleGroupById', value, (err, res) => {
        form.value = res
      })
    }
  }
)

const data = ref([])
const get = () => {
  Meteor.call('getRolesValue', (err, res) => {
    if (!err) {
      // console.log('role', res)
      data.value = res
      tab.value = res[0]._id
      console.log('role group', data.value)
    } else {
      console.log(err, 'error role')
    }
  })
}

onMounted(() => {
  // getRoles(),
  get()
})
// const groupBy = ref('Admin')
const newData = ref([])

const startCast = (str) => {
  return lodash_.startCase(str)
}
</script>
  