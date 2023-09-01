import { Meteor } from "meteor/meteor";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";
import Attendances from "./attendances";


export const insertAttendance1 = new ValidatedMethod({
  name: "insertAttendance1",
  mixins: [],
  validate: new SimpleSchema({
    type: String,
    tranDate: Date,
    reason: {
      type: String,
      optional: true,
    },
    employeeId: String,
    branchId: String,
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
  findAttendances({ selector, page, rowsPerPage }) {
    if (!Meteor.isServer) return false
    selector = selector || {}
    const limit = rowsPerPage === 0 ? Number.MAX_SAFE_INTEGER : rowsPerPage
    const skip = rowsPerPage * (page - 1)
    const data = Attendances.aggregate([
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
          employeeName: "$empDoc.name",
          branchName:"$branchDoc.name",
          reason: 1,
        },
        
      },
      {
        $project: {
          type: 1,
          tranDate: 1,
          employeeName: 1,
          branchName:1,
          reason: 1,
        },
        
      },
    ]);
    const total = Attendances.find(selector).count();
    return { data, total };
  },

  insertAttendance(doc) {
    new SimpleSchema({
      type: String,
      tranDate: Date,
      reason: {
        type: String,
        optional: true,
      },
      employeeId: String,
      branchId: String,
    }).validate(doc);

    if (!Meteor.isServer) return false;
    try {
      console.log(doc, "insert success");
      return Attendances.insert(doc);
    } catch (error) {
      console.log("insert error");
      throw new Meteor.Error("insert attendance error", error);
    }
  },
  updateAttendance(doc) {
    new SimpleSchema({
      _id:String,
      type: String,
      tranDate: Date,
      reason: {
        type: String,
        optional: true,
      },
      employeeId: String,
      branchId: String,
    }).validate(doc);

    if (!Meteor.isServer) return false;
    try {
      console.log(doc, "insert success");
      return Attendances.update({_id:doc._id},{$set:doc});
    } catch (error) {
      console.log("insert error");
      throw new Meteor.Error("insert attendance error", error);
    }
  },
  removeAttendance({ id }) {
    // validate method
    // Customer.schema.validate(doc)
    new SimpleSchema({
      id: String,
    }).validate({ id })

    if (!Meteor.isServer) return false

    try {
      return Attendances.remove({ _id: id })
    } catch (error) {
      console.log('error', error)
      throw new Meteor.Error('Remove attendance error', error)
    }
  },
  getAttendanceById(_id){
   return Attendances.findOne({_id})
  },

  fetchAttendances (selector){
    selector=selector ||{}
    const data = Attendances.aggregate([
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
          employeeName: "$empDoc.name",
          branchName:"$branchDoc.name",
          checkIn:"$branchDoc.checkIn",
          checkOut:"$branchDoc.checkOut",
          reason: 1,
        },
      },
    ])
    return data
    // return Attendances.find(selector).fetch()
  }
  // checkAttendance
});
