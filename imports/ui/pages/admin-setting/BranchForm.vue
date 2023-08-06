<template>
  <q-dialog
    :value="value"
    @hide="cancel()"
  >
    <q-card style="width: 30%; max-width: 80vw">
      <q-toolbar>
        <q-toolbar-title>{{ title }}</q-toolbar-title>

        <q-btn
          flat
          round
          dense
          icon="close"
          @click="cancel()"
        />
      </q-toolbar>

      <q-separator />

      <q-card-section>
        <validate-form
          ref="formRef"
          :validation-schema="rules"
        >
          <q-form @submit.prevent>
            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-md-12 col-lg-12">
                  <div class="row q-col-gutter-y-sm">
                    <div class="col-12">
                      <validate-field
                        v-slot="{ value, field, errorMessage }"
                        v-model="form.name"
                        name="name"
                      >
                        <q-input
                          :model-value="value"
                          label="Name *"
                          outlined
                          dense
                          v-bind="field"
                          :error="!!errorMessage"
                          :error-message="errorMessage"
                        />
                      </validate-field>
                    </div>

                    <div class="col-12">
                      <validate-field
                        v-slot="{ value, field, errorMessage }"
                        v-model="form.address"
                        name="address"
                      >
                        <q-input
                          :model-value="value"
                          label="Address"
                          outlined
                          dense
                          v-bind="field"
                          :error="!!errorMessage"
                          :error-message="errorMessage"
                        />
                      </validate-field>
                    </div>
                    <!-- q-col-gutter-y-md -->
                    <div class="row w-full q-col-gutter-x-sm">
                      <!-- Check In -->
                      <div class="col-xs-6 col-md-6 col-lg-6">
                        <q-input
                          filled
                          class="w-full"
                          v-model="form.checkIn"
                          readonly
                        >
                          <!-- :rules="['time']" -->
                          <!-- mask="time" -->
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
                                  v-model="form.checkIn"
                                  mask="HH:mm A"
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
                      <div class="col-xs-6 col-md-6 col-lg-6">
                        <q-input
                          filled
                          class="w-full"
                          v-model="form.checkOut"
                          readonly
                        >
                          <!-- :rules="['time']" -->
                          <!-- mask="time" -->
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
                                  v-model="form.checkOut"
                                  mask="HH:mm A"
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
              </div>
            </q-card-section>

            <!-- Submit -->
            <q-card-section>
              <div class="text-right q-gutter-x-md">
                <q-btn
                  label="Save"
                  color="primary"
                  :loading="loading"
                  no-caps
                  @click="submit()"
                ></q-btn>
                <q-btn
                  v-if="showId"
                  label="Remove"
                  :loading="loading"
                  no-caps
                  color="negative"
                  @click="remove"
                ></q-btn>
                <q-btn
                  label="Cancel"
                  :loading="loading"
                  no-caps
                  class="q-ml-sm"
                  @click="cancel()"
                />
              </div>
            </q-card-section>
          </q-form>
        </validate-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, toRefs, computed, onMounted, watch } from 'vue'
import { cloneDeep } from 'lodash'
import { useStore } from 'vuex'
import { Form as ValidateForm, Field as ValidateField } from 'vee-validate'
import { object, string, number, array, ref as yupRef } from 'yup'
// Lib
import Notify from '../../lib/notify'
// Composables
import useMethod from '../../composables/useMethod'
import { useQuasar } from 'quasar'
import moment from 'moment'

const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Branch',
  },
  showId: {
    type: String,
    default: null,
  },
})

const emits = defineEmits(['closed'])

const $q = useQuasar()
//
const loading = ref(false)
const { showId } = toRefs(props)

// State
const initForm = () => {
  return {
    name: '',
    address: '',
    checkIn: '08:00 AM',
    checkOut: '17:00 PM',
  }
}

const formRef = ref(null)
const form = ref(initForm())

const rules = object({
  name: string()
    .min(5)
    .max(20)
    .test('exist', 'name is taken', (value) => {
      if (!value) return true

      const _id = showId.value || null
      const selector = {
        _id: {
          $ne: _id,
        },
        name: value,
      }

      const { call } = useMethod('app.findOneUser', null)
      return call({
        selector,
      })
        .then((result) => {
          return !result
        })
        .catch(() => {
          return false
        })
    }),
  // address: string().required(),
  // email: string()
  //   .required()
  //   .email()
  //   .test('exist', 'email is taken', (value) => {
  //     if (!value) return true

  //     const _id = showId.value || null
  //     const selector = {
  //       _id: {
  //         $ne: _id,
  //       },
  //       emails: { $elemMatch: { address: value } },
  //     }

  //     const { call } = useMethod('app.findOneUser', null)
  //     return call({
  //       selector,
  //     })
  //       .then((result) => {
  //         return !result
  //       })
  //       .catch(() => {
  //         return false
  //       })
  //   }),
  // password: string().min(6),
  // confirmPassword: string().oneOf(
  //   [yupRef('password'), null],
  //   'passwords must match'
  // ),
  // status: string().required(),
})

const getUpdateDoc = () => {
  const { call } = useMethod('findOneBranchById', null)

  call({
    _id: showId.value,
  })
    .then((result) => {
      if (!result) return

      form.value = {
        _id: result._id,
        name: result.name,
        address: result.address,
        checkIn: moment(result.checkIn).format('HH:mm A'),
        checkOut: moment(result.checkOut).format('HH:mm A'),
      }
    })
    .catch((error) => {
      Notify.error({ message: error.reason || error })
    })
}

const submit = async () => {
  loading.value = true
  const { valid } = await formRef.value.validate()
  if (valid) {
    let methodName = 'insertBranch'
    if (showId.value) methodName = 'updateBranch'
    const { call } = useMethod(methodName)
    //
    const doc = cloneDeep(form.value)

    doc.checkIn = convertDateTime(form.value.checkIn)
    doc.checkOut = convertDateTime(form.value.checkOut)
    //
    call(doc)
      .then(() => {
        Notify.success({ message: 'Success' })
        showId.value ? cancel() : reset()
        loading.value = false
      })
      .catch((error) => {
        loading.value = false
        console.log(error)
        Notify.error({ message: error.reason || error })
      })
  } else {
    loading.value = false
  }
}

const remove = () => {
  $q.dialog({
    title: 'Confirm',
    message: `Do you want to remove [${form.value.name}] ?`,
    cancel: true,
    ok: {
      push: true,
    },
  })
    .onOk(() => {
      const { call } = useMethod('removeBranch', null)
      const _id = showId.value
      //
      call({ _id })
        .then(() => {
          Notify.success({ message: 'Removed' })
          cancel()
        })
        .catch((error) => {
          Notify.error({ message: error.reason || error })
        })
      //
    })
    .onOk(() => {
      // console.log('>>>> second OK catcher')
    })
    .onCancel(() => {
      // console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    })
}

const convertDateTime = (strTime) => {
  const curr = moment()
  const splitStrTime = strTime.split(':')

  curr.hours(splitStrTime[0])
  curr.minutes(splitStrTime[1])

  return curr.toDate()
}

const reset = () => {
  formRef.value?.resetForm()
  form.value = initForm()
}

const cancel = () => {
  emits('closed')
  reset()
}

onMounted(() => {
  if (showId.value) {
    getUpdateDoc()
  }
})
</script>

<style lang="scss" scoped>
fieldset {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  -webkit-margin-start: 0;
  -webkit-margin-end: 0;
  margin-bottom: 10px;
  padding: 10px 15px;
}
fieldset legend {
  color: #606266;
  font-weight: 500;
  padding: 0 5px;
}
</style>
