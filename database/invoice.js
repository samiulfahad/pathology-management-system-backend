const { ObjectId } = require("mongodb")
const moment = require("moment-timezone")

const { getClient } = require("./connection")

class Invoice {
  constructor(name, age, contact, referredBy, testList, total, netAmount, paid) {
    this.name = name
    this.age = age
    this.contact = contact
    this.referredBy = referredBy
    this.testList = testList
    this.total = total
    this.netAmount = netAmount
    this.paid = paid
    this.notified = false
    this.delivered = false
    this.completed = true
    this.createdAt = moment().format()
    this.invoiceId = moment().format("DDMMYY-HHmmss")
    this.labId = "bhaluka123"
  }

  // Insert single document
  static async insertOne(doc) {
    try {
      const db = getClient()
      const result = await db.collection("collection-1").insertOne(doc)
      return result.insertedId ? result.insertedId : null
    } catch (e) {
      return handleError(e, "insertOne")
    }
  }

  // Find one document by id
  static async findById(id) {
    try {
      const db = getClient()
      const invoice = await db.collection("collection-1").findOne({ _id: id })
      return invoice ? { success: true, invoice } : null
    } catch (e) {
      return handleError(e, "findById")
    }
  }

  static async findAll() {
    try {
      const db = getClient()
      const projection = {
        invoiceId: 1,
        name: 1,
        netAmount: 1,
        paid: 1,
        completed: 1,
        delivered: 1,
        notified: 1
      }
      const invoices = await db.collection("collection-1").find({}).project(projection).toArray()
      const total = await db.collection("collection-1").countDocuments()
      return { total, invoices }
    } catch (e) {
      return handleError(e, "findAll")
    }
  }

  // Count all documents of a collection
  static async countAll() {
    try {
      const db = getClient()
      const count = await db.collection("collection-1").countDocuments()
      if (count) {
        return count
      }
    } catch (e) {
      return handleError(e, "countAll")
    }
  }

  // Update a document
  static async updateById(_id, update) {
    try {
      const db = getClient()
      const filter = { _id: new ObjectId(_id) }
      const result = await db.collection("collection-1").updateOne(filter, { $set: update })
      if (result.modifiedCount === 0) {
        return null
      } else if (result.modifiedCount === 1) {
        return true
      }
    } catch (e) {
      return handleError(e, "updateById")
    }
  }

  // Drop a collection
  static async dropCollection() {
    try {
      const db = getClient()
      const result = await db.collection("collection-1").drop()
      if (result) {
        return true
      } else {
        return null
      }
    } catch (e) {
      return handleError(e, "dropCollection")
    }
  }
}

const handleError = (e, methodName) => {
  console.log(`${methodName} produced an error`)
  console.log(e)
  return null
}

module.exports = Invoice
