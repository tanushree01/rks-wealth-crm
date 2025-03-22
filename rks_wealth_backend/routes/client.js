const express = require("express");
const clientController = require("../controllers/clientController.js");
const {
  getFolioMasterRecords
} = require("../controllers/wealth/folioMasterController.js");
const {
  getLongTermRecords
} = require("../controllers/wealth/longTermController.js");
const { getTopSchemes } = require("../controllers/wealth/topSchemes.js");
const {
  get90DaysTransactionRecords
} = require("../controllers/wealth/transaction90daysController");

const router = express.Router();

// Routes
router.get("/diary", clientController.getClientDiaries);
router.get("/diary/one", clientController.getClientDiary);
router.get("/foliomaster", getFolioMasterRecords);
// router.get('/foliomaster', getFolioMaster);
router.get("/longterm", getLongTermRecords);
router.get("/transaction", get90DaysTransactionRecords);
router.get("/topschemes", getTopSchemes);

module.exports = router;
