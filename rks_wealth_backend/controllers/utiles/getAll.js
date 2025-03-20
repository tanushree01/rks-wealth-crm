const { Op } = require('sequelize');
const { getModel } = require("../../models");

exports.getAll = async (req, res, table) => {

    try {
        const { page = 1, limit = 10, orderBy = 'NAME', order = 'ASC', ...filters } = req.query;
        const Model = await getModel(table);
        // Convert page & limit to integers
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const offset = (pageNum - 1) * limitNum;

        // Prepare filtering conditions
        let whereCondition = {};
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                whereCondition[key] = { [Op.iLike]: `%${filters[key]}%` }; // Case-insensitive search
            }
        });

        // Fetch data with pagination, filtering, and sorting
        const { count, rows } = await Model.findAndCountAll({
            attributes: { exclude: ['id'] },
            where: whereCondition,
            order: [[orderBy, order.toUpperCase()]], // Sorting dynamically
            limit: limitNum,
            offset: offset,
        });

        return res.status(200).json({
            totalRecords: count,
            totalPages: Math.ceil(count / limitNum),
            currentPage: pageNum,
            data: rows,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
}