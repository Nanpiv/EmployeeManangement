import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";


const Employee = new Mongo.Collection('employees')

Employee.schema = new SimpleSchema({

    name:String,
    typeId:String,
    positionId:String,
    address:{
        type:String,
        optional:true
    },
    telephone:String,
    startDate:Date,
    checkIn:Date,
    checkOut:Date,
    branchId:String,
    token:{
        type:String,
        optional:true
    },

})

Employee.attachSchema(Employee.schema)

export default Employee