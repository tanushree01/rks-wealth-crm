const { getModel } = require("../../models");
const { getAll } = require("../utiles/getAll");

const table = 'transaction_90days';

exports.get90DaysTransaction = async (req, res) => {
  return getAll(req, res, table);
};

exports.get90DaysTransactionRecords = async (req, res) => {
  try {
    const Model = await getModel(table);
    const { page = 1, limit = 10, orderBy, order = "ASC", ...filters } = req.query;

    // Convert pagination params to integers
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    // Query conditions
    const whereConditions = { ...filters };

    // Add role-based filtering
    const userType = req.user.userType;
    if (userType === 'RM') {
      whereConditions[userType] = req.user.username;
    }

    const options = {
      attributes: { exclude: ["id"] }, // Exclude id field if not needed
      where: whereConditions,
      limit: limitNum,
      offset,
    };

    // Add sorting dynamically if orderBy exists
    if (orderBy) {
      options.order = [[orderBy, order.toUpperCase()]];
    }

    // Fetch data
    const { rows, count } = await Model.findAndCountAll(options);

    // Check if records exist
    if (count === 0) {
      return res.status(404).json({ message: "No 90 Days Transaction records found" });
    }

    return res.status(200).json({
      data: rows,
      totalRecords: count,
      currentPage: pageNum,
      totalPages: Math.ceil(count / limitNum)
    });

  } catch (error) {
    console.error("Error fetching 90 Days Transaction records:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.download90DaysTransactionRecords = async (req, res) => {
  try {
    const Model = await getModel(table);
    const { orderBy, order = "ASC", ...filters } = req.query;

    // Query conditions
    const whereConditions = { ...filters };

    // Add role-based filtering
    const userType = req.user.userType;
    if (userType === "RM") {
      whereConditions[userType] = req.user.username;
    }

    const options = {
      attributes: { exclude: ["id"] }, // Exclude id field if not needed
      where: whereConditions
    };

    // Add sorting dynamically if orderBy exists
    if (orderBy) {
      options.order = [[orderBy, order.toUpperCase()]];
    }

    // Fetch data
    const { rows, count } = await Model.findAndCountAll(options);

    // Check if records exist
    if (count === 0) {
      return res
        .status(404)
        .json({ message: "No 90 Days Transaction records found" });
    }
    const plainRows = rows.map((row) => row.get({ plain: true }));
  
    const workbook = await generateExcelFile(plainRows);
    // Write to response
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=90day_records.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error fetching 90 Days Transaction records:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
