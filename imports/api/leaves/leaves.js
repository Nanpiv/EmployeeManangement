import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

const Leaves= new Mongo.Collection('leaves')
Leaves.schema = new SimpleSchema({
    tranDate:Date,
    employeeId:String,
    status:String,
    reason:String,
    acceptedById:{
        type:String,
        optional:true
    },
    type:String,
    fromDate:Date,
    toDate:Date,
    branchId:String
})

Leaves.attachSchema(Leaves.schema)
export default Leaves