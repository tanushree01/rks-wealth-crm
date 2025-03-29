const { getModel } = require("../../models");
const generateExcelFile = require("../../service/generateExcelFile");
const { getAll } = require("../utiles/getAll");

const table = "folio_master";

exports.getFolioMaster = async (req, res) => {
  return getAll(req, res, table);
};

exports.getFolioMasterRecords = async (req, res) => {
  try {
    const Model = await getModel(table);
    const {
      page = 1,
      limit = 10,
      orderBy,
      order = "ASC",
      ...filters
    } = req.query;

    // Convert page and limit to integers
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    // Build where conditions from filters
    const whereConditions = {};
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        whereConditions[key] = value;
      }
    }

    const userType = req.user.userType;
    if (userType === "RM" || userType === "SRM") {
      whereConditions[userType] = req.user.userName;
    }

    const options = {
      attributes: { exclude: ["id"] },
      where: whereConditions,
      limit: limitNum,
      offset
    };

    // Add sorting dynamically if orderBy exists
    if (orderBy) {
      options.order = [[orderBy, order.toUpperCase()]];
    }

    // Fetch data from folio_master
    const { rows, count } = await Model.findAndCountAll(options);

    // Check if records exist
    if (count === 0) {
      return res
        .status(404)
        .json({ message: "No records found matching the given criteria." });
    }

    return res.status(200).json({
      data: rows,
      totalRecords: count,
      currentPage: pageNum,
      totalPages: Math.ceil(count / limitNum)
    });
  } catch (error) {
    console.error("Error fetching folio_master data:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.downloadFolioMasterRecords = async (req, res) => {
  try {
    const Model = await getModel(table);
    const { orderBy, order = "ASC", ...filters } = req.query;

    // Build where conditions from filters
    const whereConditions = {};
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        whereConditions[key] = value;
      }
    }

    const userType = req.user.userType;
    if (userType === "RM" || userType === "SRM") {
      whereConditions[userType] = req.user.userName;
    }

    const options = {
      attributes: { exclude: ["id"] },
      where: whereConditions
    };

    // Add sorting dynamically if orderBy exists
    if (orderBy) {
      options.order = [[orderBy, order.toUpperCase()]];
    }

    // Fetch data from folio_master
    const { rows, count} = await Model.findAndCountAll(options);

    // Check if records exist
    if (count === 0) {
      return res
        .status(404)
        .json({ message: "No records found matching the given criteria." });
    }

    // Create a new workbook and worksheet
    const plainRows = rows.map((row) => row.get({ plain: true }));
  
    const workbook = await generateExcelFile(plainRows);
    // Write to response
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=folio_master_records.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generating Excel file:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
