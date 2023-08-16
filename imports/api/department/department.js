import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

const Departments = new Mongo.Collection('department')

Departments.schema = new SimpleSchema({
    name:String,
    status:String,
    branchId:String
})

Departments.attachSchema(Departments.schema)
export default Departments