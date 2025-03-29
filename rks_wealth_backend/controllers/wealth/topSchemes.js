const { getModel } = require("../../models");
const generateExcelFile = require("../../service/generateExcelFile");
const { getAll } = require("../utiles/getAll");

const table = "top_scheme";

exports.getTopSchemes = async (req, res) => {
  return getAll(req, res, table, "SCHEMES");
};


exports.downloadTopSchemes = async (req, res) => {
  try {
    const {
      orderBy = "SCHEMES",
      order = "ASC",
      ...filters
    } = req.query;
    const Model = await getModel(table);
    // Convert page & limit to integers

    // Prepare filtering conditions
    let whereConditions = {};
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        whereConditions[key] = { [Op.iLike]: `%${filters[key]}%` }; // Case-insensitive search
      }
    });

    // Fetch data with pagination, filtering, and sorting
    const { count, rows } = await Model.findAndCountAll({
      attributes: { exclude: ["id"] },
      where: whereConditions,
      order: [[orderBy, order.toUpperCase()]], // Sorting dynamically
    });

    if (count === 0) {
      return res.status(404).json({ message: "No top Schemes records found" });
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
      "attachment; filename=top_schemes_records.xlsx"
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
