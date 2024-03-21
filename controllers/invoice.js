const Invoice = require("../database/invoice")
const CreateTest = require("../helpers/CreateTest")
const AllowedList = ["CBC", "RBC", "XRAY", "ECG"]

// Create a new invoice
const CreateInvoice = async (req, res, next) => {
  try {
    const { name, age, contact, referredBy, testList, total, netAmount, paid } = req.body
    // Check Test List
    for (let i = 0; i < testList.length; i++) {
      if (!AllowedList.includes(testList[i].name)) {
        throw new Error("Invalid test list @statusCode 400")
      }
    }
    const filteredTestList = testList.map((item) => {
      return { name: item.name.toUpperCase(), completed: false }
    })
    console.log("Ran after return")
    const invoice = new Invoice(name, age, contact, referredBy, filteredTestList, total, netAmount, paid)
    const invoiceId = await Invoice.insertOne(invoice)
    if (invoiceId) {
      res.status(201).send({ success: true, msg: "Invoice created", statusCode: 201 })
    } else {
      throw new Error("Could not create a new invoice @statusCode 500")
    }
    // Create Uploadable Tests
    CreateTest("bhaluka123", invoiceId, filteredTestList)
  } catch (e) {
    next(e)
  }
}

// Create a new invoice
const GetAllInvoices = async (req, res, next) => {
  try {
    const result = await Invoice.findAll()
    if (result) {
      res.status(201).send({ success: true, total: result.total, invoices: result.invoices })
    } else {
      throw new Error("Could not get all invoices @statusCode 500")
    }
  } catch (e) {
    next(e)
  }
}

// Send SMS to Patient
const NotifyPatient = async (req, res, next) => {
  try {
    const result = await Invoice.updateByInvoiceId(req.body.invoiceId, { notified: true })
    if (result) {
      res.status(201).send({ success: true, total: result.total, invoices: result.invoices })
    } else {
      throw new Error("Could not get send SMS @statusCode 500")
    }
  } catch (e) {
    next(e)
  }
}

// Update invoice
const Update = async (req, res, next) => {
  try {
    let result = null
    if (req.body.update === "delivered") {
      result = await Invoice.updateById(req.body._id, { delivered: true })
    }

    if (req.body.update === "notified") {
      result = await Invoice.updateById(req.body._id, { notified: true })
    }

    if (result) {
      res.status(201).send({ success: true })
    } else {
      throw new Error("Could not update delivery status @statusCode 500")
    }
  } catch (e) {
    next(e)
  }
}

// Drop a collection
const DropCollection = async (req, res, next) => {
  try {
    const result = await Invoice.dropCollection()
    if (result) {
      res.status(200).send({ success: true, msg: "Collection cleared" })
    } else {
      throw new Error("Could not clear invoice collection @statusCode 500")
    }
  } catch (e) {
    next(e)
  }
}

module.exports = { CreateInvoice, GetAllInvoices, NotifyPatient, Update, DropCollection }
