import Notifications from "../notifications";

    Meteor.publish('notificat',(selector)=>{
        selector=selector || {}
        return Notifications.find(selector)
    })
