import { Meteor } from "meteor/meteor";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";
import Leaves from "./leaves";
import Notifications from "../notifications/notifications";

// import { useStore } from "/imports/store";
// const store =useStore()
// const currentBranchId = store.getters['app/currentBranchId']

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
        $sort:{
          tranDate:-1
        }
      },
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

      // {$set:{acceptedById:{$ifNull:["$acceptedById", [] ]}}} ,
      // { "$match" : { "acceptedById.0" : { "$exists" : false } } },



      {
        $lookup: {
          from: "users",
          localField:'acceptedById',
          foreignField: "_id",
          as: "userDoc",
        },
      },
      { $unwind: {
        path:'$userDoc',
        "preserveNullAndEmptyArrays": true
      }},
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
          acceptedBy:"$userDoc.username",
        }}

    ])
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
      const res=Leaves.insert(doc);
      // let userId =this.userId
      const data = Notifications.insert({
        title: 'Alert',
        message:'ask for accept leave.',
        // 'Has new attendance',
        icon: 'warning',
        status:'active',
        type:"Leave",
        refId:res,
        toCreatedBy:'',
        createdBy:this.userId,
        branchId:doc.branchId,
        employeeId:doc.employeeId,
        timestamp:Date.now(),
        to:'acceptLeave'
      })

      return data
      
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

updateStatusAccepted(doc,refId){
  console.log('doc', doc);
  // return Leaves.update({_id:doc._id},{$set:{status: doc.status,acceptedById:this.userId,}})
 const updateSts= Leaves.update({_id:doc._id},{$set:{status: doc.status, acceptedById:doc.acceptedById}})
  // const removeNoti = Notifications.remove({refId:doc._id}, //match all
  const findNoti= Notifications.findOne({ refId: doc._id, })


  const data = Notifications.insert({
    title: 'Alert',
    message:`leave has been ${doc.status}`,
    // 'Has new attendance',
    icon: doc.status=='accepted'?'done':'close',
    status:'active',
    type:"Approved",
    refId:doc._id,
    // createdBy:findNoti.createdBy,
    createdBy:this.userId,
    toCreatedBy:findNoti.createdBy,
    branchId:findNoti.branchId,
    employeeId:findNoti.employeeId,
    timestamp:Date.now(),
    to:findNoti.createdBy

  })
  console.log('data',data)
  return data
 

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
        from: "users",
        localField: "acceptedById",
        foreignField: "_id",
        as: "userDoc",
      },
    },
    { $unwind: {
      path:'$userDoc',
      "preserveNullAndEmptyArrays": true
    }},
    {
      $lookup: {
        from: "employees",
        localField: "employeeId",
        foreignField: "_id",
        as: "empDoc",
      },
    },
    { $unwind: {
      path:'$empDoc',
      "preserveNullAndEmptyArrays": true
    }},
  
    {
      $project: {
        type: 1,
        tranDate: 1,
        employeeName: "$empDoc.name",
        reason: 1,
        status:1,
        fromDate:1,
        toDate:1,
        acceptedBy:"$userDoc.username"
      },
    },
  ])
  return data
  // return Attendances.find(selector).fetch()
},




});
