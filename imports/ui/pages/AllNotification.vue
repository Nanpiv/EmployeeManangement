<template>
    <div>
        <q-list >
        <q-item>
          <q-item-section class="text-body1"> Notifications </q-item-section>
        </q-item>

          
        <q-separator />
       
        <template v-for="(notiItem, index) in list" :key="index">
          <q-item v-close-popup clickable to="/Leave">
            <!-- {{ notiItem.empName }} -->
            <!-- Icon -->
            <!-- <q-item-section v-if="notiItem.icon" :key="`icon-${index}`" avatar>
              <q-avatar color="primary" text-color="white">
                <q-icon :name="notiItem.icon" />
                

              </q-avatar>
            </q-item-section> -->

            <q-item-section  avatar>
              <q-avatar color="primary" text-color="white">
                <q-icon :name="notiItem.icon" />
                <!-- <q-icon name="" /> -->

              </q-avatar>
            </q-item-section>

            <!-- Message -->
            <q-item-section :key="`message-${index}`">
              <q-item-label caption :lines="2" class="text-grey-9 message-text">
               {{ notiItem.empName}} {{ notiItem.message }}
            
              </q-item-label>
            </q-item-section>

            <q-item-section :key="`timestamp-${index}`" side top>
              <!-- {{( currentTime- notiItem.timestamp) * 0.001 % 60}}  -->
            </q-item-section>
          </q-item>
          <q-separator />

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
        <!-- <q-item dense>
          <q-item-section class="text-center q-py-xs footer-section">
            <q-btn
              
              flat
              size="sm"
              class="view-all"
              label="View All"
              no-caps
            />
          </q-item-section>
        </q-item> -->
      </q-list>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { Meteor } from 'meteor/meteor';


const list=ref([])

const fetchNoti = () =>{
  const selector = {
    createdBy: Meteor.userId(),
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


onMounted(()=>{
  fetchNoti()
})
</script>

<style scoped>
.message-text {
  font-size: 16px;
}
</style>