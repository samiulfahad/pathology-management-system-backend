const { ObjectId } = require("mongodb")

const { getClient } = require("./connection")

class CBC {
  constructor(labId, invoiceId) {
    this.whiteBloodCellCount = null
    this.redBloodCellCount = null
    this.hemoglobin = null
    this.hematocrit = null
    this.plateletCount = null
    this.completed = false
    this.invoiceId = invoiceId
    this.labId = labId
  }

  // Insert single document
  static async insertOne(doc) {
    try {
      const db = getClient()
      const result = await db.collection("cbc-bhaluka").insertOne(doc)
      return result.insertedId ? result.insertedId : null
    } catch (e) {
      return handleError(e, "insertOne")
    }
  }

  // Find a document by id
  static async findById(labId, invoiceId) {
    try {
      const db = getClient()
      const report = await db.collection("cbc-bhaluka").findOne({ labId: ObjectId(labId), invoiceId: invoiceId })
      return report ? { success: true, report } : null
    } catch (e) {
      return handleError(e, "findById")
    }
  }

  static async findAll(labId) {
    try {
      const db = getClient()
      const reports = await db.collection("cbc-bhaluka").find({labId: ObjectId(labId)}).toArray()
      const total = await db.collection("cbc-bhaluka").countDocuments()
      return { total, reports }
    } catch (e) {
      return handleError(e, "findAll")
    }
  }

  // Count all documents of a collection
  static async countAll(labId) {
    try {
      const db = getClient()
      const count = await db.collection("cbc-bhaluka").countDocuments({labId: ObjectId(labId)})
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
      const result = await db.collection("cbc-bhaluka").updateOne(filter, { $set: update })
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
      const result = await db.collection("cbc-bhaluka").drop()
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

module.exports = CBC
