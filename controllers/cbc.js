const CBC = require("../database/cbc")


// Create a new CBC
const CreateCBC = async (labId, invoiceId) => {
  const cbc = new CBC(labId, invoiceId)
  const result = await CBC.insertOne(cbc)
  if (result) {
    console.log("CBC Created")
    return true
  } else {
    throw new Error("Could not create a new cbc @statusCode 500")
  }
}

// Find all reports
const GetAllCBC = async (req, res, next) => {
  try {
    const result = await CBC.findAll(labId)
    if (result) {
      res.status(201).send({ success: true, total: result.total, cbc: result.reports })
    } else {
      throw new Error("Could not get all invoices @statusCode 500")
    }
  } catch (e) {
    next(e)
  }
}

// Drop a collection
const DropCollection = async (req, res, next) => {
  try {
    const result = await CBC.dropCollection()
    if (result) {
      res.status(200).send({ success: true, msg: "CBC Collection cleared" })
    } else {
      throw new Error("Could not clear invoice collection @statusCode 500")
    }
  } catch (e) {
    next(e)
  }
}

module.exports = { CreateCBC, GetAllCBC, DropCollection }
