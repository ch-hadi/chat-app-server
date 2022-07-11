const express = require('express')
const { accessChat , fetchChats,createGroupChat ,renameGroupChat,addToGroup,removeFromGroup} = require('../controllers/chtControllers')
const {protect} = require('../middleWare/authMiddleWare')

const router = express.Router()

router.route('/').post(protect , accessChat)
router.route('/').get(protect , fetchChats)
router.route('/group').post(protect , createGroupChat)
router.route('/rename-group').put(protect , renameGroupChat)
router.route('/remove-from-group').put(protect , removeFromGroup)
router.route('/add-to-group').put(protect , addToGroup)

module.exports = router
