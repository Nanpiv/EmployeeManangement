<template>
  <div>
    <div class="row q-col-gutter-x-xl q-col-gutter-y-xs q-mb-md">
      <!-- Info box -->
      <div
        v-for="(infoBox, index) in infoBoxList"
        :key="index"
        class="col-xs-12 col-sm-6 col-md-3"
      >
        <info-box
          :icon="infoBox.icon"
          :color="infoBox.color"
          :icon-color="infoBox.iconColor"
          :title="infoBox.title"
          :number="infoBox.number"
          :currency="infoBox.currency"
        />
      </div>
    </div>

    <div class="row q-col-gutter-x-md q-col-gutter-y-xs q-mb-md">
      <!-- Chart -->
      <div class="col-xs-12 col-sm-8">
        <q-card
          flat
          bordered
          class="chart"
        >
          <p
            class="text-overline text-bold text-center q-ma-none text-red-10 chart-title"
          >
            Chart Title
          </p>
          <LineChart />
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-4">
        <q-card
          flat
          bordered
          class="box"
        >
          <div class="text-subtitle1 q-py-sm q-px-md">Browser Usage</div>
          <q-separator />

          <q-card-section>
            <doughnut-chart />

            <div class="text-overline text-grey-9">
              Increase all usage: 10<small>%</small>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-x-md q-col-gutter-y-xs q-mb-md q-pt-sm">
      <div class="col-xs-12 col-sm-4">
        <!-- Info box -->
        <div class="col column q-col-gutter-y-sm">
          <div
            v-for="(infoBox, index) in infoBoxList2"
            :key="index"
            class="col-12"
          >
            <info-box
              :icon="infoBox.icon"
              :color="infoBox.color"
              :icon-color="infoBox.iconColor"
              :title="infoBox.title"
              :number="infoBox.number"
              :currency="infoBox.currency"
              :icon-box-bg="infoBox.iconBoxBg"
              :progress="infoBox.progress"
              :description="infoBox.description"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Components
import LineChart from '../components/dashboard/LineChart.vue'
import DoughnutChart from '../components/dashboard/DoughnutChart.vue'
import InfoBox from '../components/dashboard/InfoBox.vue'

const userList = ref([
  {
    name: 'Member 1',
    img: 'https://i.pinimg.com/564x/da/87/62/da8762242e587c4b6dfce892f762036f.jpg',
    joinDate: 'Today',
  },
  {
    name: 'Member 2',
    img: 'https://i.pinimg.com/564x/a6/95/fd/a695fdce542999c2e696785841af53ec.jpg',
    joinDate: 'Yesterday',
  },
  {
    name: 'Member 3',
    img: 'https://i.pinimg.com/564x/08/12/52/081252fbc9cd754bd0daa016284f3099.jpg',
    joinDate: '3day ago',
  },
  {
    name: 'Member 4',
    img: 'https://i.pinimg.com/564x/9f/49/cf/9f49cf9ddfcb6348eccb8fbdbf08e46b.jpg',
    joinDate: '1week ago',
  },
  {
    name: 'Member 5',
    img: 'https://i.pinimg.com/originals/33/c4/f3/33c4f3127850de7eb8884bb65ec2652b.jpg',
    joinDate: '16 june',
  },
  {
    name: 'Member 6',
    img: 'https://i.pinimg.com/564x/a7/c1/c6/a7c1c67cbf63298c331768f1e3654f64.jpg',
    joinDate: '1 June',
  },
  {
    name: 'Member 7',
    img: 'https://i.pinimg.com/564x/8e/12/7d/8e127d97a487f00b3e60abff5f0d4fa8.jpg',
    joinDate: '25 April',
  },
  {
    name: 'Member 8',
    img: 'https://i.pinimg.com/564x/94/9a/23/949a239cc4483d24882e23e35a520223.jpg',
    joinDate: '5 April',
  },
])

const infoBoxList = ref([
  {
    icon: 'settings_applications',
    color: 'bg-light-blue-9',
    iconColor: 'blue-9',
    title: 'cpu traffic',
    number: '70',
    currency: '%',
  },
  {
    icon: 'local_grocery_store',
    color: 'bg-cyan-8',
    iconColor: 'cyan-8',
    title: 'sales',
    number: '230',
  },
  {
    icon: 'thumb_up_alt',
    color: 'bg-deep-orange-9',
    iconColor: 'deep-orange-9',
    title: 'likes',
    number: '500+',
  },
  {
    icon: 'group_add',
    color: 'bg-green-7',
    iconColor: 'green-7',
    title: 'followers',
    number: '350+',
  },
])
const infoBoxList2 = ref([
  {
    icon: 'local_offer',
    color: 'bg-green-7',
    iconColor: 'white',
    title: 'INVENTORY',
    number: '5,200',
    iconBoxBg: 'bg-green-8',
    progress: 0.5,
    description: '50% Increase in 30 Days',
  },
  {
    icon: 'favorite',
    color: 'bg-deep-orange-9',
    iconColor: 'white',
    title: 'MENTIONS',
    number: '92,050',
    iconBoxBg: 'bg-deep-orange-10',
    progress: 0.2,
    description: '20% Increase in 30 Days',
  },
  {
    icon: 'archive',
    color: 'bg-cyan-8',
    iconColor: 'white',
    title: 'DOWNLOADS',
    number: '114,381',
    iconBoxBg: 'bg-cyan-9',
    progress: 0.7,
    description: '70% Increase in 30 Days',
  },
  {
    icon: 'message',
    color: 'bg-light-blue-9',
    iconColor: 'white',
    title: 'DIRECT MESSAGES',
    number: '163,921',
    iconBoxBg: 'bg-light-blue-10',
    progress: 0.4,
    description: '40% Increase in 30 Days',
  },
])
</script>

<style lang="scss" scoped>
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
  font-weight: 400;
}
</style>
