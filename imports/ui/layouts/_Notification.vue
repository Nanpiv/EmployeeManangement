<template>
  <!-- <q-btn flat round dense icon="notifications" @click="notiNumber==0?'':updateNotifi()"> -->
  <q-btn flat round dense icon="notifications" @click="notiNumber==0?'':updateNotifi()">

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
          <!-- <p @click="removeAllNotifi" class="btnClear">Clear all</p> -->
        </q-item>

          
        <q-separator />
       
        <template v-for="(notiItem, index) in list" :key="index">
          <q-item v-close-popup clickable to="/leave">
            <!-- {{ notiItem.empName }} -->
            <!-- Icon -->
            <!-- <q-item-section v-if="notiItem.icon" :key="`icon-${index}`" avatar>
              <q-avatar color="primary" text-color="white">
                <q-icon :name="notiItem.icon" />
                

              </q-avatar>
            </q-item-section> -->

            <q-item-section  avatar>
              <q-avatar :color="notiItem.icon=='close'?'red':'primary'" text-color="white">
                <q-icon :name="notiItem.icon" />
                <!-- <q-icon name="" /> -->

              </q-avatar>
            </q-item-section>

            <!-- Message -->
            <q-item-section :key="`message-${index}`">
              <q-item-label caption :lines="2" class="text-grey-9 message-text">
               <!-- <template v-for="i in notiItem.name" :key="i">
                {{ i}}
               </template> -->
               {{ notiItem.empName }}
               {{ notiItem.message }}
            
              </q-item-label>
            </q-item-section>

            <q-item-section :key="`timestamp-${index}`" side top>
              <!-- {{( currentTime- notiItem.timestamp) * 0.001 % 60}}  -->
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
              to="/allNotifications"
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
import Notify from '../lib/notify';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { Meteor } from 'meteor/meteor';
import { computed, onMounted, ref, watch,inject } from 'vue';
import { subscribe, autorun } from 'vue-meteor-tracker'
import Notifications from '/imports/api/notifications/notifications';

const userIsInRole =inject('$userIsInRole')
const $q = useQuasar()
const router =useRouter()

// subscribe('notificat')
const { ready: notiReady } = subscribe(() => [
  'notificat',
  {
    createdBy: Meteor.userId(),
    // to:Meteor.userId(),
    status:'active'
  },
])

const {result:notificat} = autorun(() => {
  if(notiReady.value) return Notifications.find({}).fetch()

  return []
})
const currentTime = Date.now()

const list=ref([])
let notiNumber = ref(0)

const updateNotifi =()=>{
//  const selector={to:Meteor.userId()}
 const selector={createdBy:Meteor.userId()}

  Meteor.call('updateNotiStatus',selector,(err,res)=>{
    if(!err){
      console.log('update notifi sucess',res)
      fetchNoti()
    }else{
      console.log('update notifi error')
    }
  })
}

const removeAllNotifi = () => {
  Meteor.call('removeAllNotifi',(err,res)=>{
    if(!err){
      // console.log('clear success',res)
      fetchNoti()
    }else{
      console.log('clear error',err)
    }
  })
}

const fetchNoti = () =>{
  const selector = {
    createdBy: Meteor.userId(),
    // to:Meteor.userId()
  }

  Meteor.call('fetchNoti1',selector,(err,res)=>{
    if(!err){
      console.log('fetch noti success',res)
      list.value = res
    }else{
      console.log('fetch notutt error',err)
    }
  })
}



watch(notificat,(items)=>{
  //  console.log('items',items)
   list.value = []
   notiNumber.value = items.length
//  Notify.success({ message: 'Have new notifications' })
fetchNoti()

})


onMounted(()=>{
  fetchNoti()
})


  

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
// const pushRoute = (branchId) =>{
//     router.push({name: 'Leave',query:{branchId: branchId}})
// }

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
.btnClear{
  width: 70px;
    margin: 0 auto;
    padding: 0;
    // color: #1565c0;
    // font-weight: 600;
    &:hover {
      text-decoration: underline;
    }
}
</style>