import { Meteor } from "meteor/meteor";
import SimpleSchema from "simpl-schema";
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import Departments from "./department";


export const insertDepartment1 = new ValidatedMethod({
    name:'insertDepartment1',
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
            console.log('insert department error')
            throw new Meteor.Error('insert error')
        }
    }
})
Meteor.methods({

    findDepartment({selector,page,rowsPerPage}){
        if(!Meteor) return false
        selector = selector || {}
        const limit =rowsPerPage ===0?Number.MAX_SAFE_INTEGER:rowsPerPage
        const skip = rowsPerPage *(page-1)

        const data = Departments.aggregate([
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
        const total =Departments.find(selector).count()
        return {data,total}
    },
    insertDepartment(doc){
        new SimpleSchema({
            name:String,
            branchId:String,
            status:String
        }).validate(doc)
        if(!Meteor) return false 
        try{
            console.log(doc,'insert department success')
            return Departments.insert(doc)
        }catch(error){

            throw new Meteor.Error('insert department error')
        }
    },
    checkDepartmentExist({selector}) {
        return Departments.findOne(selector)
      },
      getDepartmentById(id) {
        return Departments.findOne({ _id: id })
      },

      updateDepartment(doc) {
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
          return Departments.update({ _id: doc._id }, { $set: doc })
        } catch (error) {
          console.log('error', error)
          throw new Meteor.Error('Update customer error', error)
        }
      },
      removeDepartment({ id }) {
        // validate method
        // Customer.schema.validate(doc)
        new SimpleSchema({
          id: String,
        }).validate({ id })
    
        if (!Meteor.isServer) return false
    
        try {
          return Departments.remove({ _id: id })
        } catch (error) {
          console.log('error', error)
          throw new Meteor.Error('Remove department error', error)
        }
      },
      fetchDepartment(selector) {
        return Departments.find(selector).fetch()
      },
      countDepart(selector){
     return Departments.find(selector).count()
      }
})

