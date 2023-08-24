import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

const Notifications = new Mongo.Collection('notifications')

Notifications.schema = new SimpleSchema({
    title: String,
    message:String,
    icon: String,
    type:String,
    toCreatedBy:{
        type:String,
        optional:true
    }, // 001
    createdBy:String, // 001 , 002
    refId:String, //===res in leave  = id
    status:String,//default active 
    branchId:String,
    employeeId:String, // A
    timestamp:Date,
    to:String,
})

Notifications.attachSchema(Notifications.schema)
export default Notifications;