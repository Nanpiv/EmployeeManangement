import { Meteor } from "meteor/meteor";
import SimpleSchema from "simpl-schema";
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import Employee from "./employees";


export const insertEmployee1 = new ValidatedMethod({
    name:'insertEmployee1',
    mixins:[],
    validate:new SimpleSchema({
      name:String,
      typeId:String,
      positionId:String,
      address:{
          type:String,
          optional:true
      },
      telephone:String,
      startDate:Date,
      checkIn:Date,
      checkOut:Date,
      branchId:String,
      token:{
          type:String,
          optional:true
      },
    }).validator(),
    run(doc){
        if(!Meteor) return false
        try{

        }catch(error){
            console.log('insert Employee error')
            throw new Meteor.Error('insert error')
        }
    }
})
Meteor.methods({

    findEmployee({selector,page,rowsPerPage}){
        if(!Meteor) return false
        selector = selector || {}
        const limit =rowsPerPage ===0?Number.MAX_SAFE_INTEGER:rowsPerPage
        const skip = rowsPerPage *(page-1)

        const data = Employee.aggregate([
            {
                $match:selector,
            },
            {
                $limit:limit,
            },
            {
                $skip:skip
            },
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
              $lookup: {
                  from: "positions",
                  localField: "positionId",
                  foreignField: "_id",
                  as: "posDoc",
                },
          },
          { $unwind: "$posDoc" },
          {
            $lookup: {
                from: "employeeTypes",
                localField: "typeId",
                foreignField: "_id",
                as: "typeDoc",
              },
        },
        { $unwind: "$typeDoc" },
            {
                $project:{
                    name:1,
                    status:1,
                    typeName:"$typeDoc.name",
                    positionName:'$posDoc.name',
                    address:1,
                    telephone:1,
                    startDate:1,
                    branchName:"$branchDoc.name",
                    checkIn:1,
                    checkOut:1,
                    token:1


                }
            }
        ])
        const total =Employee.find(selector).count()
        return {data,total}
    },
    insertEmployee(doc){
        new SimpleSchema({
          name:String,
          typeId:String,
          positionId:String,
          address:{
              type:String,
              optional:true
          },
          telephone:String,
          startDate:Date,
          checkIn:Date,
          checkOut:Date,
          branchId:String,
          token:{
              type:String,
              optional:true
          },
        }).validate(doc)
        if(!Meteor) return false 
        try{
            console.log(doc,'insert Employee success')
            return Employee.insert(doc)
        }catch(error){

            throw new Meteor.Error('insert Employee error')
        }
    },
    checkEmployeeExist({selector}) {
        return Employee.findOne(selector)
      },
      getEmployeeById(id) {
        return Employee.findOne({ _id: id })
      },

      updateEmployee(doc) {
        
        new SimpleSchema({
          _id: String,
          name:String,
    typeId:String,
    positionId:String,
    address:{
        type:String,
        optional:true
    },
    telephone:String,
    startDate:Date,
    checkIn:Date,
    checkOut:Date,
    branchId:String,
    token:{
        type:String,
        optional:true
    },
        }).validate(doc)
    
        if (!Meteor.isServer) return false
    
        try {
          return Employee.update({ _id: doc._id }, { $set: doc })
        } catch (error) {
          console.log('error', error)
          throw new Meteor.Error('Update Employee error', error)
        }
      },
      removeEmployee({ id }) {
        
        new SimpleSchema({
          id: String,
        }).validate({ id })
    
        if (!Meteor.isServer) return false
    
        try {
          return Employee.remove({ _id: id })
        } catch (error) {
          console.log('error', error)
          throw new Meteor.Error('Remove Employee error', error)
        }
      },
      fetchEmployee(selector) {
        return Employee.find(selector).fetch()
      }
})

