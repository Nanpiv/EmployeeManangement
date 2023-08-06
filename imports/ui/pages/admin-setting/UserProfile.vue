<template>
  <q-card>
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
                    v-model="form.fullName"
                    name="fullName"
                  >
                    <q-input
                      :model-value="value"
                      label="FullName *"
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
                <div class="col-12">
                  <validate-field
                    v-slot="{ value, field, errorMessage }"
                    v-model="form.oldPassword"
                    name="oldPassword"
                  >
                    <q-input
                      :model-value="value"
                      label="Old Password *"
                      outlined
                      dense
                      type="password"
                      v-bind="field"
                      :error="!!errorMessage"
                      :error-message="errorMessage"
                    />
                  </validate-field>
                </div>

                <div class="col-12">
                  <validate-field
                    v-slot="{ value, field, errorMessage }"
                    v-model="form.password"
                    name="password"
                  >
                    <q-input
                      :model-value="value"
                      label="New Password *"
                      outlined
                      dense
                      type="password"
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
                      label="New Confirm Password *"
                      outlined
                      dense
                      type="password"
                      v-bind="field"
                      :error="!!errorMessage"
                      :error-message="errorMessage"
                    />
                  </validate-field>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-right q-gutter-x-md">
            <q-btn
              label="Save Change"
              color="primary"
              no-caps
              @click="submit"
            />
          </div>
        </q-card-section>
      </q-form>
    </validate-form>
  </q-card>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { Form as ValidateForm, Field as ValidateField } from 'vee-validate'
import { object, string, ref as yupRef } from 'yup'
import { cloneDeep } from 'lodash'
import { useStore } from '/imports/store'
// Composables
import useMethod from '/imports/ui/composables/useMethod'
import Notify from '../../lib/notify'

const store = useStore()
// const { logout } = useAuth()

const logout = () => {}

const currentUser = computed(() => {
  return store.state.app.currentUser
})

// State
const loading = ref(false)
const formRef = ref(null)
const form = ref({
  _id: '',
  fullName: '',
  username: '',
  email: '',
  oldPassword: '',
  password: '',
  confirmPassword: '',
  status: '',
})

const rules = object({
  fullName: string().required(),
  username: string()
    .min(5)
    .max(20)
    .required()
    .test('exist', 'username is taken', (value) => {
      if (!value) return true

      const _id = form.value._id || null
      const selector = {
        _id: {
          $ne: _id,
        },
        username: value,
      }

      const { call } = useMethod('app.findOneUser')
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
  email: string()
    .email()
    .test('exist', 'email is taken', (value) => {
      if (!value) return true

      const _id = form.value._id || null
      const selector = {
        _id: {
          $ne: _id,
        },
        emails: { $elemMatch: { address: value } },
      }

      const { call } = useMethod('app.findOneUser')
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
  oldPassword: string()
    .min(6)
    .required()
    .test('correct', 'oldPassword is no correct', (value) => {
      if (!value) return true

      const { call } = useMethod('app.validateUserPassword')
      //
      return call({ password: value })
        .then((res) => {
          return !res.error
        })
        .catch(() => {
          return false
        })
    }),
  password: string().min(6).required(),
  confirmPassword: string().oneOf(
    [yupRef('password'), null],
    'passwords must match'
  ),
})

watch(
  currentUser.value,
  (user) => {
    if (user) {
      form.value = {
        _id: user._id,
        username: user.username,
        email: user.emails[0].address,
        fullName: user.profile.fullName,
        oldPassword: '',
        password: '',
        confirmPassword: '',
        status: user.profile.status,
      }
    }
  },
  { immediate: true }
)

const submit = async () => {
  const { valid } = await formRef.value.validate()

  if (valid) {
    // Do your job
    const doc = cloneDeep(form.value)
    delete doc.oldPassword
    delete doc.confirmPassword

    const { call } = useMethod('app.updateUser')
    call({ user: doc })
      .then((res) => {
        Notify.success({ message: 'Success' })
      })
      .catch((error) => {
        Notify.error({ message: error.reason || error })
      })
  }
}
</script>
