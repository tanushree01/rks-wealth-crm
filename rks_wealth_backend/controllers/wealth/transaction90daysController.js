const { getModel } = require("../../models");
const { getAll } = require("../utiles/getAll");

const table = 'transaction_90days';

exports.get90DaysTransaction = async (req, res) => {
return getAll(req, res, table);
};


exports.get90DaysTransactionRecords = async (req, res) => {
    try {

        const Model = await getModel(table);
        const { PAN, page = 1, limit = 10, orderBy, order = "ASC" } = req.query;

        // Validate required field
        if (!PAN) {
            return res.status(400).json({ message: "PAN is required." });
        }

        // Convert pagination params to integers
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const offset = (pageNum - 1) * limitNum;

        // Query conditions
        const whereConditions = { "PAN": PAN };

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