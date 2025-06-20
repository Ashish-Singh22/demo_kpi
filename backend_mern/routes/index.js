const express = require("express")
const uploadPickerController = require("../controller/worker/uploadPickerController")
const findPickerController = require("../controller/worker/findPickerController")
const uploadPackerController = require("../controller/worker/uploadPackerController")
const findPackerController = require("../controller/worker/findPackerController")
const uploadShipmentController = require("../controller/dn/uploadShipmentController")
const findShipmentController = require("../controller/dn/findShipmentController")
const uploadProductivityController = require("../controller/dn/uploadProductivityController")
const findProductivityController = require("../controller/dn/findProductivityController")

const router = express.Router()

//worker
router.post('/workerPickingUpload',uploadPickerController)
router.post('/find-picker',findPickerController)
router.post('/workerPackingUpload',uploadPackerController)
router.post('/find-packer',findPackerController)

//dn
router.post('/shipment-upload',uploadShipmentController)
router.post('/find-shipment',findShipmentController)
router.post('/productivity-upload',uploadProductivityController)
router.post('/find-productivity',findProductivityController)


module.exports = router