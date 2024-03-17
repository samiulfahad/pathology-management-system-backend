const { Invoice } = require("../database/invoice")

// Create a new invoice
const CreateInvoice = async (req, res, next) => {
  try {
    const { name, age, contact, referredBy, testList, total, netAmount, paid } = req.body
    const invoice = new Invoice(name, age, contact, referredBy, testList, total, netAmount, paid)
    const result = await Invoice.insertOne(invoice)
    if (result) {
      res.status(201).send({ success: true, msg: "Invoice created", statusCode: 201 })
    } else {
      throw new Error("Could not create a new invoice @statusCode 500")
    }
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


// Drop a collection
const DropCollection = async (req, res, next) => {
  try{
    const result = await Invoice.dropCollection()
    if(result) {
      res.status(200).send({ success: true, msg: "Collection cleared" })
    } else {
      throw new Error("Could not clear invoice collection @statusCode 500")
    }
  } catch(e){
    next(e)
  }
}


module.exports = { getHome, CreateInvoice, GetAllInvoices, DropCollection }
