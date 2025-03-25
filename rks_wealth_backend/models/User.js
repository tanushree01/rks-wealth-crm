const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  gender: { type: DataTypes.ENUM('Male', 'Female', 'Other'), allowNull: false },
  address: { type: DataTypes.TEXT, allowNull: false },
  maritalStatus: { type: DataTypes.ENUM('Single', 'Married', 'Divorced', 'Widowed'), allowNull: false },
  userType: { type: DataTypes.ENUM('Admin','RM','SRM'), defaultValue: 'Admin' },
}, { timestamps: true });

module.exports = User;
