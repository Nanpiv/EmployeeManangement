import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";


const Branches = new Mongo.Collection('branches')

Branches.schema = new SimpleSchema({
    name:String,
    address:{
        type:String,
        optional:true
    },
    checkIn:Date,
    checkOut:Date
})
Branches.attachSchema(Branches.schema)

export default Branches
