import { Meteor } from 'meteor/meteor'
// Collections
import Branches from "./branches";

Meteor.methods({
  fetchBranches(selector: any) {
    return Branches.find(selector).fetch()
  },
  findOneBranchById({ _id }: { _id: string }) {
    return Branches.findOne({ _id: _id })
  },
  insertBranch(doc: any) {
    const _id = Branches.insert(doc);
    // TODO: Add allowed branches to super
    allowedBranches({ branchId: _id })
    return _id
  },
  updateBranch(doc: any) {
    return Branches.update({ _id: doc._id }, { $set: doc })
  },
  removeBranch({ _id }: { _id: string }) {
    // TODO: remove allowed branches to super
    allowedBranches({ branchId: _id, isRemove: true })

    return Branches.remove({ _id })
  },
  branchOpts(selector: any) {
    selector = selector || {}
    return Branches.aggregate([
      {
        $match: selector
      },
      {
        $project: {
          name: 1
        }
      }
    ])
  },


});


// TODO: Add and remove allowed branches to user super
const allowedBranches = ({ branchId, isRemove }: { branchId: string, isRemove?: boolean }) => {
  const { _id = '', profile }: any = Meteor.users.findOne({ username: 'super' })

  if (_id) {
    if (!isRemove) {
      if(!profile?.allowedBranches?.length){
        profile.allowedBranches=[]
      }
      profile.allowedBranches.push(branchId)
    } else {
      // Remove
      profile.allowedBranches = profile.allowedBranches.filter((it: string) => it !== branchId);
    }

    return Meteor.users.update({ _id }, { $set: { profile } })
  }

  return false
}