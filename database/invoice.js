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
    this.completed = false
    this.createdAt = moment().tz("GMT+6").format()
    this.invoiceId = moment().tz("GMT+6").format("DDMMYY-HHmmss")
    this.labId = new ObjectId()
  }

  // Insert single document
  static async insertOne(doc) {
    try {
      const db = getClient()
      const result = await db.collection("collection-1").insertOne(doc)
      if (result.insertedId) {
        const doc = await this.findById(result.insertedId)
        console.log(doc)
        return true
      } else {
        return null
      }
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
      const invoices = await db.collection("collection-1").find({}).toArray()
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
  static async updateById(id, update) {
    try {
      const db = getClient()
      const filter = { _id: ObjectId(id) }
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

module.exports = { Invoice }