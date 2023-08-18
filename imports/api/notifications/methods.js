import { Meteor } from "meteor/meteor";
import Notifications from "./notifications";


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
    }
})

if(Meteor.isServer){
    Meteor.publish('notificat',()=>{
        return Notifications.find({})
    })
}

// if(Meteor.isServer){
//     Meteor.publish('updateNotifi',()=>{
//         return Notifications.update({}, //match all
//         {
//             $set: {
//                 status: 'readed'
//             }
//         }, 
//         {
//             multi: true,
//         }
        
//         )
//     })
// }




// updateStatusAccepted(doc){
//     console.log('doc', doc);
//     // return Leaves.update({_id:doc._id},{$set:{status: doc.status,acceptedById:this.userId,}})
//     return Leaves.update({_id:doc._id},{$set:{status: doc.status, acceptedById:doc.acceptedById}})
  
//   },