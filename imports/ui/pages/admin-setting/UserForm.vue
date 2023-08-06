<template>
  <q-dialog
    :value="value"
    @hide="cancel()"
  >
    <q-card style="width: 70%; max-width: 80vw">
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
              <div class="row q-col-gutter-x-xl q-col-gutter-y-md">
                <div class="col-xs-12 col-md-6 col-lg-6">
                  <div class="row q-col-gutter-y-sm">
                    <div class="col-12">
                      <validate-field
                        v-slot="{ value, field, errorMessage }"
                        v-model="form.username"
                        name="username"
                      >
                        <q-input
                          :model-value="value"
                          label="Username *"
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
                        v-model="form.fullName"
                        name="fullName"
                      >
                        <q-input
                          :model-value="value"
                          label="Full name *"
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
                        v-model="form.email"
                        name="email"
                      >
                        <q-input
                          :model-value="value"
                          label="Email *"
                          outlined
                          dense
                          v-bind="field"
                          :error="!!errorMessage"
                          :error-message="errorMessage"
                        />
                      </validate-field>
                    </div>
                  </div>
                </div>

                <div class="col-xs-12 col-md-6 col-lg-6">
                  <div class="row q-col-gutter-y-sm">
                    <!-- Update  -->

                    <div
                      v-if="showId"
                      class="col-12"
                    >
                      <!-- <fieldset>
                        <legend>
                          Change Password
                          <q-toggle v-model="isUpdatePassword" />
                        </legend> -->
                      <!-- <q-toggle v-model="isUpdatePassword">
                        <q-tooltip
                          class="bg-indigo"
                          :offset="[10, 10]"
                        >
                          Change Password
                        </q-tooltip>
                      </q-toggle> -->

                      <div class="row q-col-gutter-y-sm">
                        <div class="col-12">
                          <div class="row q-col-gutter-y-sm">
                            <div
                              v-if="showId"
                              class="col-2"
                            >
                              <q-toggle v-model="isUpdatePassword">
                                <q-tooltip
                                  transition-show="flip-right"
                                  transition-hide="flip-left"
                                  class="bg-black"
                                  :offset="[10, 10]"
                                >
                                  Change Password
                                </q-tooltip>
                              </q-toggle>
                            </div>
                            <div
                              v-if="isUpdatePassword"
                              class="col-10"
                            >
                              <validate-field
                                v-slot="{ value, field, errorMessage }"
                                v-model="form.password"
                                name="password"
                              >
                                <q-input
                                  :model-value="value"
                                  label="Password *"
                                  type="password"
                                  outlined
                                  dense
                                  v-bind="field"
                                  :error="!!errorMessage"
                                  :error-message="errorMessage"
                                />
                              </validate-field>
                            </div>
                          </div>
                        </div>

                        <div
                          v-if="isUpdatePassword"
                          class="col-12"
                        >
                          <validate-field
                            v-slot="{ value, field, errorMessage }"
                            v-model="form.confirmPassword"
                            name="confirmPassword"
                          >
                            <q-input
                              :model-value="value"
                              label="Confirm password *"
                              type="password"
                              outlined
                              dense
                              v-bind="field"
                              :error="!!errorMessage"
                              :error-message="errorMessage"
                            />
                          </validate-field>
                        </div>
                      </div>
                      <!-- </fieldset> -->
                    </div>

                    <!-- New -->
                    <template v-else>
                      <div class="col-12">
                        <validate-field
                          v-slot="{ value, field, errorMessage }"
                          v-model="form.password"
                          name="password"
                        >
                          <q-input
                            :model-value="value"
                            label="Password *"
                            type="password"
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
                          v-model="form.confirmPassword"
                          name="confirmPassword"
                        >
                          <q-input
                            :model-value="value"
                            label="Confirm Password *"
                            type="password"
                            outlined
                            dense
                            v-bind="field"
                            :error="!!errorMessage"
                            :error-message="errorMessage"
                          />
                        </validate-field>
                      </div>
                    </template>

                    <div class="col-12">
                      <validate-field
                        v-slot="{ value, field, errorMessage }"
                        v-model="form.allowedBranches"
                        name="allowedBranches"
                      >
                        <q-select
                          dense
                          outlined
                          :model-value="value"
                          label="Allowed Branches"
                          :options="branchOpts"
                          v-bind="field"
                          multiple
                          map-options
                          clearable
                          emit-value
                          option-value="_id"
                          option-label="name"
                        />
                        <div
                          v-if="!!errorMessage"
                          class="text-negative"
                          style="font-size: 11px"
                        >
                          {{ errorMessage }}
                        </div>
                      </validate-field>
                    </div>

                    <div class="col-12">
                      <validate-field
                        v-slot="{ value, field, errorMessage }"
                        v-model="form.status"
                        name="status"
                      >
                        <span
                          class="text-grey-9"
                          style="padding-right: 8px"
                        >
                          Status
                        </span>

                        <q-option-group
                          :model-value="value"
                          :options="statusOpts"
                          v-bind="field"
                          color="primary"
                          inline
                          style="display: inline-block"
                        />

                        <div
                          v-if="!!errorMessage"
                          class="text-negative"
                          style="font-size: 11px"
                        >
                          {{ errorMessage }}
                        </div>
                      </validate-field>
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
import { useStore } from '/imports/store'
import { Form as ValidateForm, Field as ValidateField } from 'vee-validate'
import { object, string, number, array, ref as yupRef } from 'yup'
// Lib
import Notify from '../../lib/notify'
// Composables
import useMethod from '../../composables/useMethod'
import { useQuasar } from 'quasar'

const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'User',
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
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    status: 'Active',
    allowedBranches: [],
  }
}

const branchOpts = ref([])
const formRef = ref(null)
const form = ref(initForm())

const rules = object({
  username: string()
    .min(5)
    .max(20)
    .test('exist', 'username is taken', (value) => {
      if (!value) return true

      const _id = showId.value || null
      const selector = {
        _id: {
          $ne: _id,
        },
        username: value,
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
  fullName: string().required(),
  allowedBranches: array().min(1).of(string()),
  email: string()
    .required()
    .email()
    .test('exist', 'email is taken', (value) => {
      if (!value) return true

      const _id = showId.value || null
      const selector = {
        _id: {
          $ne: _id,
        },
        emails: { $elemMatch: { address: value } },
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
  password: string().min(6),
  confirmPassword: string().oneOf(
    [yupRef('password'), null],
    'passwords must match'
  ),
  status: string().required(),
})

const isUpdatePassword = ref(false)

const statusOpts = ref([
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
])

const getBrachOpts = () => {
  const { call } = useMethod('branchOpts')

  call()
    .then((res) => {
      branchOpts.value = res
    })
    .catch((error) => {
      console.log(error)
    })
}

const getUpdateDoc = () => {
  const { call } = useMethod('app.findOneUser', null)

  call({
    selector: {
      _id: showId.value,
    },
  })
    .then((result) => {
      if (!result) return

      form.value = {
        _id: result._id,
        fullName: result.profile.fullName,
        username: result.username,
        password: '',
        email: result.emails[0].address,
        status: result.profile.status,
        allowedBranches: result.profile.allowedBranches,
      }
      isUpdatePassword.value = false
    })
    .catch((error) => {
      Notify.error({ message: error.reason || error })
    })
}

const submit = async () => {
  loading.value = true
  const { valid } = await formRef.value.validate()
  if (valid) {
    let methodName = 'app.insertUser'
    if (showId.value) methodName = 'app.updateUser'
    const { call } = useMethod(methodName)
    //
    const user = cloneDeep(form.value)
    delete user.confirmPassword
    if (showId.value && !isUpdatePassword.value) delete user.password
    //
    call({ user })
      .then((res) => {
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
    message: `Do you want to remove [${form.value.username}] ?`,
    cancel: true,
    ok: {
      push: true,
    },
  })
    .onOk(() => {
      const { call } = useMethod('app.removeUser', null)
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
  getBrachOpts()
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
