import { Meteor } from "meteor/meteor";
import Notifications from "./notifications";
import Employee from "../employees/employees";

Meteor.methods({
    insertNotifications (doc){
        return Notifications.insert(doc)
    },
    updateNotiStatus(doc){
      // const findNoti= Notifications.find({ to: doc.to, })
        return Notifications.update({to:doc.to}, //match all
        {
            $set: {
                status: 'readed'
            }
        }, 
        {
            multi: true,
        }
        
        )
    },
    removeAllNotifi(){
        return Notifications.remove({})
    },

    fetchNoti1(selector){
        selector = selector || {}
        return Notifications.aggregate([
            {
                $match:selector
            },
            {
                $sort:{
                    timestamp:-1
                }
            },
            {
                $limit:10
            },
            {
                $lookup: {
                  from: "branches",
                  localField: "branchId",
                  foreignField: "_id",
                  as: "branchDoc",
                },
              },
              { $unwind: {
                path:'$branchDoc',
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
             $lookup: {
                          from: "users",
                          localField: "employeeId",
                          foreignField: "_id",
                          as: "userDoc",
                        },
                      },
                      { $unwind: {
                        path:'$userDoc',
                        "preserveNullAndEmptyArrays": true
                      }},
                 {
                     $project:{
                            
                            title: 1,
                            message:1,
                            icon: 1,
                            timestamp:1,
                            // name: {
                            //     $cond: {
                            //       if: {
                            //         $eq: ['empName', undefined]
                            //       },
                            //       then: 0,
                            //       else: ["$userDoc.username",'$empDoc.name'],
                            //     }
                            //   },
                            empName:"$empDoc.name",
                              brachName:"$branchDoc.name"
                        }
                      },
                      {
                        $project:{
                            title: 1,
                            message:1,
                            icon: 1,
                            timestamp:1,
                            empName: 1,
                            brachName:1,
                            branchId:1

                            
                        }
                      }

                ])
    },
  //   findNotiId(doc) {
  //     const findNoti= Notifications.findOne({ _id: doc._id, })
  //     const data = Notifications.insert({
  //   title: 'Alert',
  //   message:`${doc.status} your request.`,
  //   // 'Has new attendance',
  //   icon: 'done',
  //   status:'active',
  //   type:"Approved",
  //   refId:updateSts,
  //   createdBy:'',
  //   // toCreatedBy:doc.createdBy,
  //   branchId:'',
  //   employeeId:'',
  //   timestamp:Date.now()

  // })
  // console.log(data)
  // return data
  //   },
})




