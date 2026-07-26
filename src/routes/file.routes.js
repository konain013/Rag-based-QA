const express = require('express')
const router = express.Router()

const upload = require('../config/multer.config')
const {
    uploadFile,
    uploadMultipleFiles,
    getAllFiles,
    getFileById,
    deleteFile,
    updateFile
} = require('../controllers/file.controllers')

const authmiddleware = require('../middleware/auth.middleware')
const authorize = require('../middleware/authorize.middleware')

router.post('/uploads', authmiddleware, upload.single("file"), uploadFile)
router.post('/uploads/multiple', authmiddleware, upload.array("files", 5), uploadMultipleFiles)
router.get('/all', authmiddleware, authorize("admin", "user"), getAllFiles)
router.get('/:id', authmiddleware, authorize("admin", "user"), getFileById)
router.put('/:id', authmiddleware, authorize("admin", "user"), upload.single("file"), updateFile)
router.delete('/:id', authmiddleware, authorize("admin", "user"), deleteFile)

module.exports = router;