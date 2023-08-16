import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

const Attendances = new Mongo.Collection('attendances')

Attendances.schema = new SimpleSchema({
    type:String,
    tranDate:Date,
    reason:{
        type:String,
        optional:true
    },
    employeeId:String,
    branchId:String
})

Attendances.attachSchema(Attendances.schema)
export default Attendances