import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

const Positions = new Mongo.Collection('positions')

Positions.schema = new SimpleSchema({
    name:String,
    status:String,
    departmentId:String,
    branchId:String
})

Positions.attachSchema(Positions.schema)
export default Positions