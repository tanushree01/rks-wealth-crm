const { getModel } = require("../../models");
const { getAll } = require("../utiles/getAll");

const table = 'long_term';

exports.getLongTerm = async (req, res) => {
return getAll(req, res, table);
};



exports.getLongTermRecords = async (req, res) => {
    try {

        const Model = await getModel(table);
        const { folioNumber, page = 1, limit = 10, orderBy, order = "ASC" } = req.query;

        // Validate required field
        if (!folioNumber) {
            return res.status(400).json({ message: "folioNumber is required." });
        }

        // Convert pagination params to integers
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const offset = (pageNum - 1) * limitNum;

        // Query conditions
        const whereConditions = { "FOLIO NO": folioNumber };

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
            return res.status(404).json({ message: "No long-term records found for the given Folio Number." });
        }

        return res.status(200).json({
            data: rows,
            totalRecords: count,
            currentPage: pageNum,
            totalPages: Math.ceil(count / limitNum)
        });

    } catch (error) {
        console.error("Error fetching long-term records:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};