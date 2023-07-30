<template>
  <q-dialog
    v-model="visibleDialog"
    no-esc-dismiss
    no-backdrop-dismiss
    @hide="cancel()"
  >
    <q-card style="width: 70%; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Branch</div>
      </q-card-section>

      <q-card-section>
        <validate-form ref="refForm" :validation-schema="rules">
          <q-form @submit.prevent>
            <div class="row q-col-gutter-x-xl q-col-gutter-y-md">
              <div class="col-xs-12 col-md-6 col-lg-6">
                <div class="row q-col-gutter-y-sm">
                  <div class="col-12">
                    <validate-field
                      v-slot="{ value, field, errorMessage }"
                      v-model="form.name"
                      name="name"
                    >
                      <q-input
                        :model-value="value"
                        outlined
                        dense
                        label="Name *"
                        v-bind="field"
                        :error="!!errorMessage"
                        :error-message="errorMessage"
                      ></q-input>
                    </validate-field>
                  </div>
                  <div class="col-12">
                    <validate-field
                      v-slot="{ value, field }"
                      v-model="form.address"
                      name="address"
                    >
                      <q-input
                        :model-value="value"
                        label="Address"
                        outlined
                        dense
                        v-bind="field"
                        required
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
                      v-model="form.checkIn"
                      name="checkIn"
                    >
                      <label for="">Check In</label>
                      <div class="q-pa-md" style="max-width: 300px">
                        <q-input
                          readonly
                          clearable
                          :model-value="value"
                          v-bind="field"
                        >
                          <template v-slot:prepend>
                            <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy
                                transition-show="scale"
                                transition-hide="scale"
                              >
                                <q-date
                                  :v-model="value"
                                  mask="YYYY-MM-DD HH:mm"
                                ></q-date>
                              </q-popup-proxy>
                            </q-icon>
                          </template>

                          <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                              <q-popup-proxy
                                transition-show="scale"
                                transition-hide="scale"
                              >
                                <q-time
                                  :v-model="value"
                                  mask="YYYY-MM-DD HH:mm"
                                  format24h
                                ></q-time>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                      </div>
                    </validate-field>
                  </div>
                  <div class="col-12">
                    <validate-field
                      v-slot="{ value, field }"
                      v-model="form.checkOut"
                      name="checkOut"
                    >
                      <div class="q-pa-md" style="max-width: 300px">
                        <q-input
                          readonly
                          
                          :model-value="value"
                          v-bind="field"
                        >
                          <template v-slot:prepend>
                            <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy
                                transition-show="scale"
                                transition-hide="scale"
                              >
                                <q-date
                                  :v-model="value"
                                  mask="YYYY-MM-DD HH:mm"
                                ></q-date>
                              </q-popup-proxy>
                            </q-icon>
                          </template>

                          <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                              <q-popup-proxy
                                transition-show="scale"
                                transition-hide="scale"
                              >
                                <q-time
                                @input="$refs.qDateProxy.hide()"
                                  :v-model="value"
                                  mask="YYYY-MM-DD HH:mm"
                                  format24h
                                ></q-time>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                      </div>
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
  name: "Com",
};
</script>

<script setup>
import Notify from "/imports/ui/lib/notify";
import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import { Form as ValidateForm, Field as ValidateField } from "vee-validate";
import { object, string, number, array, ref as yupRef } from "yup";

const $q = useQuasar();
const props = defineProps({
  dialog: {
    type: Boolean,
    default: true,
  },
  showId: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["closed"]);

const initForm = {
  name: "",
  address: "",
  checkIn: new Date('2019-02-01 12:44'),
  checkOut: new Date('2019-02-01 12:44'),
};

// const statusOpts = [
//   { label: 'Active', value: 'active' },
//   { label: 'Inactive', value: 'inactive' },
// ]
// data properties
const refForm = ref();
const form = ref({ ...initForm });
const visibleDialog = ref(false);

const rules = object({
  name: string()
    .min(4)
    .test("exist", "Name is required", (value) => {
      if (!value) return true;

      let selector = {
        // name: {
        //   // $regex: new RegExp('^' + value.replace(/%/g, '.*') + '$', 'i'),
        //   $regex: new RegExp(value, 'i'),
        // },
        name: value,
      };
      if (props.showId) {
        selector._id = { $ne: props.showId };
      }

      return checkExistBranch(selector)
        .then((res) => {
          return !res;
        })
        .catch(() => false);
    }),
});

const checkExistBranch = (selector) => {
  return new Promise((resolve, reject) => {
    Meteor.call("checkExistBranch", { selector }, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

const submit = async () => {
  const { valid } = await refForm.value.validate();

  if (valid) {
    if (form.value._id) {
      update();
    } else {
      insert();
    }
  }
};

const insert = () => {
  Meteor.call("insertBranch", form.value, (err, res) => {
    if (err) {
      console.log("insert error", err);
      Notify.error({ message: err.reason || err });
    } else {
      Notify.success({ message: "Success" });
      cancel();
    }
  });
};

const update = () => {
  Meteor.call("updateBranch", form.value, (err, res) => {
    if (err) {
      Notify.error({ message: err.reason || err });
    } else {
      Notify.success({ message: "Success" });
      cancel();
    }
  });
};

//remove
const remove = () => {
  $q.dialog({
    title: "Confirm",
    message: `Do you want to remove [${form.value.name}] ?`,
    cancel: true,
    ok: {
      push: true,
    },
  }).onOk(() => {
    Meteor.call("removeBranch", { id: props.showId }, (err, res) => {
      if (err) {
        Notify.error({ message: err.reason || err });
      } else {
        Notify.success({ message: "Success" });
        cancel();
      }
    });
    //
  });
};
const reset = () => {
  // refForm.value.resetValidation()
  // refForm.value.reset()
  // console.log(refForm.value)
  delete form.value._id;
  form.value = { ...initForm };
};

// cancel
const cancel = () => {
  reset();
  emit("closed", false);
};

watch(
  () => props.dialog,
  (value) => {
    visibleDialog.value = value;
  }
);

watch(
  () => props.showId,
  (value) => {
    if (value) {
      Meteor.call("getBranchById", value, (err, res) => {
        form.value = res;
      });
    }
  }
);
</script>
