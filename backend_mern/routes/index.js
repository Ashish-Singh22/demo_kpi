const express = require("express")
const uploadPickerController = require("../controller/worker/uploadPickerController")
const findPickerController = require("../controller/worker/findPickerController")

const router = express.Router()

//worker
router.post('/workerPickingUpload',uploadPickerController)
router.post('/find-picker',findPickerController)


module.exports = router