import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

declare global {
  interface MongoCollection<
    I,
    T = Omit<I, '_id'> & { _id?: string },
    U = Omit<I, '_id'> & { _id: string }
  > extends Mongo.Collection<T, U> {
    attachSchema?: (schema: SimpleSchema) => void | undefined
  }
}

export { }
