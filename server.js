const express = require("express")
const cors = require("cors")

const invoiceController = require("./controllers/invoice")
const { connect } = require("./database/connection")

const app = express()

//Middlewares
app.use(express.json({ limit: "2mb" }))
app.use(cors())

app.get('/', (req, res, next)=> {
    res.status(200).send({success: true, msg: "Server is running"})
})
app.post('/api/v1/invoice/create', invoiceController.CreateInvoice)
app.get("/api/v1/invoice/all", invoiceController.GetAllInvoices )
app.get("/api/v1/clear", invoiceController.DropCollection )

// Error Handling Center
app.use((err, req, res, next) => {
  console.log(err)
  let errMsg = err.message
  let statusCode = 500
  if (err.message.includes("@statusCode")) {
    errMsg = err.message.split("@statusCode")[0]
    statusCode = err.message.split("@statusCode")[1]
    statusCode = parseInt(statusCode)
  }
  res.status(statusCode).send({ success: false, message: errMsg, statusCode })
})

// Start the Server
app.listen(3000, async () => {
  console.log("Server is running")
  try {
    await connect()
  } catch (e) {
    console.log("Error in connecting database")
    console.log(e)
  }
})
