import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

const Notifications = new Mongo.Collection('notifications')

Notifications.schema = new SimpleSchema({
    title: String,
    message:String,
    icon: String,
    type:String,
    createdBy:String,
    refId:String, //===res in leave  = id
    status:String,//default active 
    branchId:String,
    employeeId:String,
    timestamp:Date
})

Notifications.attachSchema(Notifications.schema)
export default Notifications;