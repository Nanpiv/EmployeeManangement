import Branches from "./branches";
import { Meteor } from "meteor/meteor";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";

export const insertBranch1 = new ValidatedMethod({
  name: "insertBranch1",
  mixins: [],
  validate: new SimpleSchema({
    name: String,
    address: {
      type: String,
      optional: true,
    },
    checkIn: Date,
    checkOut: Date,
  }).validator(),
  run(doc) {
    if (!Meteor.isServer) return false;
    try {
    } catch (error) {
      console.log(error);
      throw new Meteor.Error("insert branch error", error);
    }
  },
});

Meteor.methods({
  findBranches({ selector, page, rowsPerPage }) {
    if (!Meteor.isServer) return false;
    selector = selector || {};
    const limit = rowsPerPage === 0 ? Number.MAX_SAFE_INTEGER : rowsPerPage;
    const skip = rowsPerPage * (page - 1);

    const data = Branches.aggregate([
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
        $project: {
          name: 1,
          address: 1,
          checkIn: { $dateToString: { format: "%H:%M", date: "$checkIn" } },
          checkOut: { $dateToString: { format: "%H:%M", date: "$checkOut" } },
        },
      },
    ]);
    const total = Branches.find(selector).count();
    return { data, total };
  },
  checkExistBranch({ selector }) {
    return Branches.findOne(selector);
  },
  getBranchById(id) {
    return Branches.findOne({ _id: id });
  },
  insertBranch(doc) {
    // validate method
    // Customer.schema.validate(doc)
    new SimpleSchema({
      name: String,
      address: {
        type: String,
        optional: true,
      },
      checkIn: Date,
      checkOut: Date,
    }).validate(doc);

    if (!Meteor.isServer) return false;

    try {
      console.log("doc", doc);
      // Comsert1.insert(doc)
      return Branches.insert(doc);
    } catch (error) {
      console.log("error", error);
      throw new Meteor.Error("Insert branch error", error);
    }
  },

  updateBranch(doc) {
    new SimpleSchema({
      _id: String,
      name: String,
      address: {
        type: String,
        optional: true,
      },
      checkIn: Date,
      checkOut: Date,
    }).validate(doc);
    if (!Meteor.isServer) return false;
    try {
      return Branches.update({ _id: doc._id }, { $set: doc });
    } catch (error) {
      console.log("error", error);
      throw new Meteor.Error("Update branch error", error);
    }
  },
  removeBranch({ id }) {
    new SimpleSchema({
      id: String,
    }).validate({ id });
    if (!Meteor.isServer) return false;
    try {
      return Branches.remove({ _id: id });
    } catch (error) {
      console.log("error", error);
      throw new Meteor.Error("remove branch error", error);
    }
  },
});
