const { getModel } = require("../../models");
const generateExcelFile = require("../../service/generateExcelFile");
const { getAll } = require("../utiles/getAll");

const table = "top_schemes";

exports.getTopSchemes = async (req, res) => {
  return getAll(req, res, table, "SCHEMES");
};


exports.downloadTopSchemes = async (req, res) => {
  try {
    const {
      orderBy = orderByDefalut,
      order = "ASC",
      ...filters
    } = req.query;
    const Model = await getModel(table);
    // Convert page & limit to integers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    // Prepare filtering conditions
    let whereConditions = {};
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        whereConditions[key] = { [Op.iLike]: `%${filters[key]}%` }; // Case-insensitive search
      }
    });
    const userType = req.user.userType;
    if (userType === 'RM') {
      whereConditions[userType] = req.user.username;
    }

    // Fetch data with pagination, filtering, and sorting
    const { count, rows } = await Model.findAndCountAll({
      attributes: { exclude: ["id"] },
      where: whereConditions,
      order: [[orderBy, order.toUpperCase()]], // Sorting dynamically
      limit: limitNum,
      offset: offset
    });

    if (count === 0) {
      return res.status(404).json({ message: "No long-term records found" });
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
      "attachment; filename=Long_Term_records.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
