const { getModel } = require("../../models");
const { getAll } = require("../utiles/getAll");

const table = "folio_master";

exports.getFolioMaster = async (req, res) => {
  return getAll(req, res, table);
};

exports.getFolioMasterRecords = async (req, res) => {
  try {
    const Model = await getModel(table);
    const {
      FolioPAN,
      MintPAN,
      EMAIL,
      MOBILE,
      page = 1,
      limit = 10,
      orderBy,
      order = "ASC"
    } = req.query;

    // Convert page and limit to integers
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    // Validation: Ensure all required fields are present
    if (!FolioPAN || !MintPAN || !EMAIL || !MOBILE) {
      return res
        .status(400)
        .json({
          message: "FolioPAN, MintPAN, EMAIL, and MOBILE are required fields."
        });
    }

    // Exact match conditions
    const whereConditions = {
      FolioPAN,
      MintPAN,
      EMAIL,
      MOBILE: "'" + MOBILE + ""
    };

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
