import { Meteor } from "meteor/meteor";
import SimpleSchema from "simpl-schema";
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import Positions from "./positions";



export const insertPosition1 = new ValidatedMethod({
    name:'insertPosition1',
    mixins:[],
    validate:new SimpleSchema({
        name:String,
        status:String,
        departmentId:String,
        branchId:String
    }).validator(),
    run(doc){
        if(!Meteor) return false
        try{

        }catch(error){
            console.log('insert position error')
            throw new Meteor.Error('insert error')
        }
    }
})
Meteor.methods({

    findPosition({selector,page,rowsPerPage}){
        if(!Meteor) return false
        selector = selector || {}
        const limit =rowsPerPage ===0?Number.MAX_SAFE_INTEGER:rowsPerPage
        const skip = rowsPerPage *(page-1)

        const data = Positions.aggregate([
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
                    from: "department",
                    localField: "departmentId",
                    foreignField: "_id",
                    as: "departDoc",
                  },
            },
            { $unwind: "$branchDoc" },
            {
                $project:{
                    name:1,
                    status:1,
                    branchName:"$branchDoc.name",
                    departmentName:"$departDoc.name"
                }
            }
        ])
        const total =Positions.find(selector).count()
        return {data,total}
    },
    insertPosition(doc){
        new SimpleSchema({
            name:String,
            branchId:String,
            departmentId:String,
            status:String
        }).validate(doc)
        if(!Meteor) return false 
        try{
            console.log(doc,'insert position success')
            return Positions.insert(doc)
        }catch(error){

            throw new Meteor.Error('insert position error')
        }
    },
    checkPositionExist({selector}) {
        return Positions.findOne(selector)
      },
      getPositionById(id) {
        return Positions.findOne({ _id: id })
      },

      updatePosition(doc) {
        // validate method
        // Customer.schema.validate(doc)
        new SimpleSchema({
          _id: String,
          name: String,
          departmentId:String,
         branchId:String,
          status: String,
        }).validate(doc)
    
        if (!Meteor.isServer) return false
    
        try {
          return Positions.update({ _id: doc._id }, { $set: doc })
        } catch (error) {
          console.log('error', error)
          throw new Meteor.Error('Update position error', error)
        }
      },
      removePosition({ id }) {
        // validate method
        // Customer.schema.validate(doc)
        new SimpleSchema({
          id: String,
        }).validate({ id })
    
        if (!Meteor.isServer) return false
    
        try {
          return Positions.remove({ _id: id })
        } catch (error) {
          console.log('error', error)
          throw new Meteor.Error('Remove position error', error)
        }
      },
      fetchPosition(selector) {
        return Positions.find(selector).fetch()
      }
})

