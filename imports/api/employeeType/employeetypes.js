import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

const EmployeeTypes = new Mongo.Collection('employeeTypes')

EmployeeTypes.schema = new SimpleSchema({
    name:String,
    status:String,
    branchId:String
})

EmployeeTypes.attachSchema(EmployeeTypes.schema)

export default EmployeeTypes