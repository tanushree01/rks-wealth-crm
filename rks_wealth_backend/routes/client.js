const express = require('express');
const clientController = require('../controllers/clientController.js');
const {getFolioMaster} = require('../controllers/wealth/folioMasterController.js');
const {getLongTerm} = require('../controllers/wealth/longTermController.js');
const {getTopSchemes} = require('../controllers/wealth/topSchemes.js');
const {get90DaysTransaction} = require('../controllers/wealth/transaction90daysController');


const router = express.Router();

// Routes
router.get('/diary', clientController.getClientDiaries);
router.get('/foliomaster', getFolioMaster);
router.get('/longterm', getLongTerm);
router.get('/topschemes', getTopSchemes);
router.get('/transaction', get90DaysTransaction);

module.exports = router;
