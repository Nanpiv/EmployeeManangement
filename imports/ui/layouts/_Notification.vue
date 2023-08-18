<template>
  <q-btn flat round dense icon="notifications" @click="updateNotifi()">
    <q-badge color="red" floating transparent>
      {{ notiNumber }}
    </q-badge>
    <q-menu
      :offset="[0, 13]"
      square
      transition-show="scale"
      transition-hide="scale"
    >
      <!-- Header -->
      <q-list style="max-width: 350px">
        <q-item>
          <q-item-section class="text-body1"> Notifications </q-item-section>
        </q-item>

        <q-separator />

        <template v-for="(notiItem, index) in notificat" :key="index">
          <q-item v-close-popup clickable>
            {{ notiItem.name }}
            <!-- Icon -->
            <!-- <q-item-section v-if="notiItem.icon" :key="`icon-${index}`" avatar>
              <q-avatar color="primary" text-color="white">
                <q-icon :name="notiItem.icon" />
                

              </q-avatar>
            </q-item-section> -->

            <q-item-section  avatar>
              <q-avatar color="primary" text-color="white">
                <!-- <q-icon :name="notiItem.icon" /> -->
                <q-icon name="warning" />

              </q-avatar>
            </q-item-section>

            <!-- Message -->
            <q-item-section :key="`message-${index}`">
              <q-item-label caption :lines="2" class="text-grey-9 message-text">
                {{ notiItem.message }}
                <!-- Has new attendance. -->
              </q-item-label>
            </q-item-section>

            <q-item-section :key="`timestamp-${index}`" side top>
              <!-- {{ notiItem.timestamp }} --> just now
            </q-item-section>
          </q-item>

          <!-- Separator -->
          <q-separator
            v-if="index + 1 < notiNumber"
            :key="`separator-${index}`"
          />
          <!-- <q-separator>
            {{ notiNumber }}
          </q-separator> -->
        </template>

        <q-separator />

        <!-- See all -->
        <q-item dense>
          <q-item-section class="text-center q-py-xs footer-section">
            <q-btn
              
              flat
              size="sm"
              class="view-all"
              label="View All"
              no-caps
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>

</template>

<script setup>
import {
  ClosePopup,
  QSeparator,
  QAvatar,
  QIcon,
  QBtn,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QBadge,
  QMenu,
} from 'quasar'

import { Meteor } from 'meteor/meteor';
import { onMounted, ref, watch } from 'vue';

import { subscribe, autorun } from 'vue-meteor-tracker'
// import Leaves from '/imports/api/leaves/leaves';
import Notifications from '/imports/api/notifications/notifications';

//subcribe

subscribe('notificat')
const notificat = autorun(() => Notifications.find({}).fetch()).result
const notifiNum = autorun(() => Notifications.find({status:'active'}).fetch()).result

console.log(notificat)

const updateNotifi =()=>{
  Meteor.call('updateNotiStatus',(err,res)=>{
    if(!err){
      console.log('update notifi sucess',res)
    }else{
      console.log('update notifi error')
    }
  })
}


// updateStatusAccepted(doc){
//     console.log('doc', doc);
//     // return Leaves.update({_id:doc._id},{$set:{status: doc.status,acceptedById:this.userId,}})
//     return Leaves.update({_id:doc._id},{$set:{status: doc.status, acceptedById:doc.acceptedById}})
  
//   },

// const notifications = ref([
//   {
//     title: 'Alert',
//     message:
//       'Youre receiving this email because of your account on gitlab.com.',
//     icon: 'security',
//     timestamp: '3h',
//     route: { name: 'alert' },
//   },
//   {
//     title: 'Alert',
//     message:
//       'Youre receiving this email because of your account on gitlab.com.',
//     icon: 'warning',
//     // timestamp: '3h',
//     // route: { name: 'alert' },
//   },
// ])

let notiNumber = ref(0)

watch(()=>notificat.value,(value)=>{
  notiNumber.value = notifiNum.value.length
  console.log(notiNumber.value)
})

</script>

<style lang="scss" scoped>
.message-text {
  font-size: 13px;
}
.footer-section {
  .view-all {
    width: 70px;
    margin: 0 auto;
    padding: 0;
    color: #1565c0;
    font-weight: 600;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>