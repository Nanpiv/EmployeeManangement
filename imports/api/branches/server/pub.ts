import { Meteor } from 'meteor/meteor'
import Branches from '../branches'

Meteor.publish('app.branches', (selector = {}, options = {}) => Branches.find(selector, options))
