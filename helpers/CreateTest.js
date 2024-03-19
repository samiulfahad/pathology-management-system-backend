const { CreateCBC } = require("../controllers/cbc")

const CreateTest = (labId, invoiceId, testList) => {
  testList.forEach(async (item) => {
    if (item.name === "CBC") {
      await CreateCBC(labId, invoiceId)
    }
  })
}

module.exports = CreateTest
