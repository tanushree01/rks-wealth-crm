const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ClientDiary = sequelize.define(
  "ClientDiary",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    RM: {
      type: DataTypes.STRING(255)
    },
    SUB_BROKER: {
      type: DataTypes.STRING(255)
    },
    FAMILY_HEAD: {
      type: DataTypes.STRING(255)
    },
    NAME: {
      type: DataTypes.STRING(255)
    },
    PAN: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    IW_AUM: {
      type: DataTypes.DECIMAL(15, 2)
    },
    REFERRED_BY: {
      type: DataTypes.STRING(255)
    },
    IW_USERNAME: {
      type: DataTypes.STRING(255)
    },
    IWELL_CODE: {
      type: DataTypes.STRING(255)
    },
    AGE: {
      type: DataTypes.INTEGER
    },
    EQUITY: {
      type: DataTypes.DECIMAL(15, 2)
    },
    HYBRID: {
      type: DataTypes.DECIMAL(15, 2)
    },
    DEBT: {
      type: DataTypes.DECIMAL(15, 2)
    },
    RKS_AUM: {
      type: DataTypes.DECIMAL(15, 2)
    },
    DEBT_PERCENTAGE: {
      type: DataTypes.DECIMAL(5, 2)
    },
    EQUITY_PERCENTAGE: {
      type: DataTypes.DECIMAL(5, 2)
    },
    HYBRID_PERCENTAGE: {
      type: DataTypes.DECIMAL(5, 2)
    },
    EMAIL: {
      type: DataTypes.STRING(255)
    },
    MOBILE: {
      type: DataTypes.STRING(15)
    },
    DATE_OF_BIRTH: {
      type: DataTypes.DATEONLY
    },
    IW_CREATION_DATE: {
      type: DataTypes.DATE
    },
    IW_LAST_LOGIN: {
      type: DataTypes.DATE
    },
    SIP_STATUS: {
      type: DataTypes.STRING(50)
    },
    RKS_M1: {
      type: DataTypes.DECIMAL(15, 2)
    },
    RKS_M2: {
      type: DataTypes.DECIMAL(15, 2)
    },
    RKS_M3: {
      type: DataTypes.DECIMAL(15, 2)
    },
    RKS_M4: {
      type: DataTypes.DECIMAL(15, 2)
    },
    OTHER_M1: {
      type: DataTypes.DECIMAL(15, 2)
    },
    OTHER_M2: {
      type: DataTypes.DECIMAL(15, 2)
    },
    OTHER_M3: {
      type: DataTypes.DECIMAL(15, 2)
    },
    OTHER_M4: {
      type: DataTypes.DECIMAL(15, 2)
    },
    INVESTMENT: {
      type: DataTypes.DECIMAL(15, 2)
    },
    SWITCH_IN: {
      type: DataTypes.DECIMAL(15, 2)
    },
    REDEMPTION: {
      type: DataTypes.DECIMAL(15, 2)
    },
    SWITCH_OUT: {
      type: DataTypes.DECIMAL(15, 2)
    },
    DIVIDEND_PAYOUT: {
      type: DataTypes.DECIMAL(15, 2)
    },
    NET_INVESTMENT: {
      type: DataTypes.DECIMAL(15, 2)
    },
    PURCHASE_VALUE: {
      type: DataTypes.DECIMAL(15, 2)
    },
    CURRENT_VALUE: {
      type: DataTypes.DECIMAL(15, 2)
    },
    AVG_HOLDING_DAYS: {
      type: DataTypes.INTEGER
    },
    GAIN: {
      type: DataTypes.DECIMAL(15, 2)
    },
    ABSOLUTE_RETURN: {
      type: DataTypes.DECIMAL(5, 2)
    },
    CAGR: {
      type: DataTypes.DECIMAL(5, 2)
    },
    CITY_STATE: {
      type: DataTypes.STRING(255)
    },
    FULL_ADDRESS: {
      type: DataTypes.TEXT
    }
  },
  {
    tableName: "client_diary",
    timestamps: false
  }
);

module.exports = ClientDiary;
