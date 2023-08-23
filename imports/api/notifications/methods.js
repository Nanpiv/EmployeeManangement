import { Meteor } from "meteor/meteor";
import Notifications from "./notifications";
import Employee from "../employees/employees";

Meteor.methods({
    insertNotifications (doc){
        return Notifications.insert(doc)
    },
    updateNotiStatus(){
        return Notifications.update({}, //match all
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
    fetchNoti(selector){
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
                        $project:{
                            empName:"$empDoc.name",
                            title: 1,
                            message:1,
                            icon: 1,
                        }
                      }
                ])
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
                        $project:{
                            empName:"$empDoc.name",
                            title: 1,
                            message:1,
                            icon: 1,
                        }
                      }
                ])
    }
})




