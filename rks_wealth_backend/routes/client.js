const express = require("express");
const clientController = require("../controllers/clientController.js");
const {
  getFolioMasterRecords,
  downloadFolioMasterRecords
} = require("../controllers/wealth/folioMasterController.js");
const {
  getLongTermRecords,
  downloadLongTermRecords
} = require("../controllers/wealth/longTermController.js");
const { getTopSchemes } = require("../controllers/wealth/topSchemes.js");
const {
  get90DaysTransactionRecords,
  download90DaysTransactionRecords
} = require("../controllers/wealth/transaction90daysController");
const authMiddleware = require("../middlewares/auth/authMiddleware.js");
const roleMiddleware = require("../middlewares/auth/roleMiddleware.js");

const router = express.Router();

// Routes
router.get(
  "/diary/one/download",
  authMiddleware,
  roleMiddleware(["Admin", "RM"]),
  clientController.downloadClientDiary
);
router.get("/diary/one", authMiddleware, clientController.getClientDiary);


router.get(
  "/diary/download",
  authMiddleware,
  roleMiddleware(["Admin", "RM"]),
  clientController.downloadClientDiaries
);
router.get("/diary", authMiddleware, clientController.getClientDiaries);



router.get(
  "/foliomaster/download",
  authMiddleware,
  roleMiddleware(["Admin", "RM"]),
  downloadFolioMasterRecords
);
router.get("/foliomaster", authMiddleware, getFolioMasterRecords);

router.get(
  "/longterm/download",
  authMiddleware,
  roleMiddleware(["Admin", "RM"]),
  downloadLongTermRecords
);
router.get("/longterm", authMiddleware, getLongTermRecords);


router.get(
  "/transaction/download",
  authMiddleware,
  roleMiddleware(["Admin", "RM"]),
  download90DaysTransactionRecords
);


router.get("/transaction", authMiddleware, get90DaysTransactionRecords);

router.get("/topschemes", authMiddleware, getTopSchemes);

module.exports = router;
