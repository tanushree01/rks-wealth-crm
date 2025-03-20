const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

async function defineModel(tableName) {
  try {
    const columns = await sequelize.query(
      `SELECT 
      c.COLUMN_NAME, 
      c.DATA_TYPE, 
      c.CHARACTER_MAXIMUM_LENGTH, 
      CASE 
          WHEN kcu.COLUMN_NAME IS NOT NULL THEN 'PRI' 
          ELSE '' 
      END AS COLUMN_KEY, 
      c.IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS c
      LEFT JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu 
          ON c.TABLE_NAME = kcu.TABLE_NAME 
          AND c.COLUMN_NAME = kcu.COLUMN_NAME
          AND kcu.CONSTRAINT_NAME IN (
              SELECT CONSTRAINT_NAME 
              FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
              WHERE TABLE_NAME = :tableName 
              AND CONSTRAINT_TYPE = 'PRIMARY KEY'
          )
      WHERE c.TABLE_NAME = :tableName;`,
      {
        replacements: { tableName },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const attributes = {};

    columns.forEach((column) => {
      let sequelizeType;

      switch (column.data_type.toLowerCase()) {
        case "int":
        case "integer":
          sequelizeType = DataTypes.INTEGER;
          break;
        case "bigint":
          sequelizeType = DataTypes.BIGINT;
          break;
        case "varchar":
        case "char":
        case "text":
          sequelizeType = DataTypes.STRING(column.character_maximum_length || 255);
          break;
        case "decimal":
        case "numeric":
          sequelizeType = DataTypes.DECIMAL(15, 2);
          break;
        case "date":
          sequelizeType = DataTypes.DATEONLY;
          break;
        case "datetime":
        case "timestamp":
          sequelizeType = DataTypes.DATE;
          break;
        default:
          sequelizeType = DataTypes.STRING;
      }

      attributes[column.column_name] = {
        type: sequelizeType,
        allowNull: column.is_nullable === "YES",
        primaryKey: column.column_key === "PRI",
        autoIncrement: column.column_key === "PRI",
      };
    });

    return sequelize.define(tableName, attributes, {
      tableName,
      timestamps: false,
    });
  } catch (error) {
    console.error("Error defining model:", error);
    return null;
  }
}

async function getModel(tableName) {
  const model = await defineModel(tableName);
  if (!model) throw new Error(`Failed to create model for ${tableName}`);
  return model;
}

module.exports = { getModel };
