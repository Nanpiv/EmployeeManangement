import { Meteor } from "meteor/meteor";
import SimpleSchema from "simpl-schema";
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import EmployeeTypes from "./employeetypes";
import { date } from "yup";


export const insertEmployeeType1 = new ValidatedMethod({
    name:'insertEmployeeType1',
    mixins:[],
    validate:new SimpleSchema({
        name:String,
        status:String,
        branchId:String
    }).validator(),
    run(doc){
        if(!Meteor) return false
        try{

        }catch(error){
            console.log('insert EmployeeType error')
            throw new Meteor.Error('insert error')
        }
    }
})
Meteor.methods({

    findEmployeeType({selector,page,rowsPerPage}){
        if(!Meteor) return false
        selector = selector || {}
        const limit =rowsPerPage ===0?Number.MAX_SAFE_INTEGER:rowsPerPage
        const skip = rowsPerPage *(page-1)

        const data = EmployeeTypes.aggregate([
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
                $project:{
                    name:1,
                    status:1,
                    branchName:"$branchDoc.name"
                }
            }
        ])
        const total =EmployeeTypes.find(selector).count()
        return {data,total}
    },
    insertEmployeeType(doc){
        new SimpleSchema({
            name:String,
            branchId:String,
            status:String
        }).validate(doc)
        if(!Meteor) return false 
        try{
            console.log(doc,'insert EmployeeType success')
            return EmployeeTypes.insert(doc)
        }catch(error){

            throw new Meteor.Error('insert EmployeeType error')
        }
    },
    checkEmployeeTypeExist({selector}) {
        return EmployeeTypes.findOne(selector)
      },
      getEmployeeTypeById(id) {
        return EmployeeTypes.findOne({ _id: id })
      },

      updateEmployeeType(doc) {
        // validate method
        // Customer.schema.validate(doc)
        new SimpleSchema({
          _id: String,
          name: String,
         branchId:String,
          status: String,
        }).validate(doc)
    
        if (!Meteor.isServer) return false
    
        try {
          return EmployeeTypes.update({ _id: doc._id }, { $set: doc })
        } catch (error) {
          console.log('error', error)
          throw new Meteor.Error('Update customer error', error)
        }
      },
      removeEmployeeType({ id }) {
        // validate method
        // Customer.schema.validate(doc)
        new SimpleSchema({
          id: String,
        }).validate({ id })
    
        if (!Meteor.isServer) return false
    
        try {
          return EmployeeTypes.remove({ _id: id })
        } catch (error) {
          console.log('error', error)
          throw new Meteor.Error('Remove EmployeeType error', error)
        }
      },
      fetchEmployeeType(selector) {
      return EmployeeTypes.find(selector).fetch()
        
      //   const data = EmployeeTypes.aggregate([+
        
      //     {
      //       $lookup: {
      //           from: "branches",
      //           localField: "branchId",
      //           foreignField: "_id",
      //           as: "branchDoc",
      //         },
      //   },
      //   { $unwind: "$branchDoc" },
      //   {
      //       $project:{
      //           name:1,
               
      //           branchName:"$branchDoc.name",
      //           checkIn:"$branchDoc.checkIn",
      //           checkOut:"$branchDoc.checkOut"
      //       }
      //   }
      //   ])
      //   return data
      }
      
})

