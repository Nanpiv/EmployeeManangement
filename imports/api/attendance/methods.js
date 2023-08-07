import { Meteor } from "meteor/meteor";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";
import Attendances from "./attendance";

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
        $project: {
          type: 1,
          tranDate: 1,
          employeeName: "$empDoc.name",
          branchId: 1,
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
  // getAttendanceById(_id){
  //  return Attendances.findOne({_id})
  // },
  // checkAttendance
});
