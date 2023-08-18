<!-- <template>
    <div>List
        <ul v-for="index in find" :key="index">

            <li>{{ index.name }}</li>
            <li>{{ index.age }}</li>
        </ul>
    </div><br>
    <q-input label="name" v-model="form.name"/>
    <q-input label="age" v-model="form.age"/>
    <q-btn @click="insert()" label="Insert"/>

</template>

<script setup>
import { Meteor } from 'meteor/meteor';
import { onMounted, ref } from 'vue';

import { subscribe, autorun } from 'vue-meteor-tracker'
import Test from '/imports/api/test/test';
const test =ref([])
//subcribe

subscribe('find')
const find = autorun(() => Test.find({}).fetch()).result

const form = ref({
    name:'',
    age:''
})

//method

//insert
const insert =()=>{
    Meteor.call('insertTest',form.value,(err,res)=>{
        if(!err){
            console.log('success')
            test.value = res
            form.value={}
        }else{
            console.log('error')
        }
    })
}

// onMounted(()=>{

// })
</script>

<style  scoped>

</style>../../api/notifications/test -->




<template>
    <div>
hello
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>