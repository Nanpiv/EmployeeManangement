import { Meteor } from "meteor/meteor";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";
import Leaves from "./leaves";



export const insertLeave1 = new ValidatedMethod({
  name: "insertLeave1",
  mixins: [],
  validate: new SimpleSchema({
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
  }).validator(),
  run(doc) {
    if (!Meteor.isServer) return false;
    try {
    } catch (error) {
      throw new Meteor.Error("error insert", error);
    }
  },
});

Meteor.methods({
  findLeaves({ selector, page, rowsPerPage }) {
    if (!Meteor.isServer) return false
    selector = selector || {}
    const limit = rowsPerPage === 0 ? Number.MAX_SAFE_INTEGER : rowsPerPage
    const skip = rowsPerPage * (page - 1)
    const data = Leaves.aggregate([
      {
        $match: selector,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "employees",
          localField: "employeeId",
          foreignField: "_id",
          as: "empDoc",
        },
      },
      { $unwind: "$empDoc" },
      {
        $lookup: {
          from: "branches",
          localField: "branchId",
          foreignField: "_id",
          as: "branchDoc",
        },
      },
      { $unwind: "$branchDoc" },
      {
        $project: {
          type: 1,
          tranDate: 1,
          status:1,
          acceptedById:1,
          fromDate:1,
          toDate:1,
          employeeName: "$empDoc.name",
          branchName:"$branchDoc.name",
          reason: 1,
        },
      },
    ]);
    const total = Leaves.find(selector).count();
    return { data, total };
  },

  insertLeave(doc) {
    new SimpleSchema({
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
    }).validate(doc);

    if (!Meteor.isServer) return false;
    try {
      console.log(doc, "insert success");
      return Leaves.insert(doc);
    } catch (error) {
      console.log("insert error");
      throw new Meteor.Error("insert Leaves error", error);
    }
  },
  updateLeave(doc) {
    new SimpleSchema({
      _id:String,
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
    }).validate(doc);

    if (!Meteor.isServer) return false;
    try {
      console.log(doc, "insert success");
      return Leaves.update({_id:doc._id},{$set:doc});
    } catch (error) {
      console.log("insert error");
      throw new Meteor.Error("insert Leaves error", error);
    }
  },
  removeLeave({ id }) {
    // validate method
    // Customer.schema.validate(doc)
    new SimpleSchema({
      id: String,
    }).validate({ id })

    if (!Meteor.isServer) return false

    try {
      return Leaves.remove({ _id: id })
    } catch (error) {
      console.log('error', error)
      throw new Meteor.Error('Remove Leaves error', error)
    }
  },
  getLeaveById(_id){
   return Leaves.findOne({_id})
  },

updateStatusAccepted(doc){
  console.log('doc', doc);
  return Leaves.update({_id:doc._id},{$set:{status: doc.status,acceptedById:doc.acceptedById}})
},
// updateStatusCancel(doc){
//   return Leaves.update({_id:doc._id},{$set:{...doc,status:'accepted'}})
// },
 

fetchLeave (selector){
  selector=selector ||{}
  const data = Leaves.aggregate([
    {
      $match: selector,
    },
    {
      $lookup: {
        from: "employees",
        localField: "employeeId",
        foreignField: "_id",
        as: "empDoc",
      },
    },
    { $unwind: "$empDoc" },
    {
      $project: {
        type: 1,
        tranDate: 1,
        employeeName: "$empDoc.name",
        reason: 1,
        status:1,
        fromDate:1,
        toDate:1,
        acceptedById:1
      },
    },
  ])
  return data
  // return Attendances.find(selector).fetch()
}

});
