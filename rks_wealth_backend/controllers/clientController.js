const { Op } = require("sequelize");
const { getModel } = require("../models");

const table = 'client_diary';

exports.getClientDiaries = async (req, res) => {
    try {
        const {
          page = 1,
          limit = 10,
          orderBy,
          order = "ASC",
          ...filters
        } = req.query;
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
    
        const options = {
            attributes: { exclude: ["id"] },
            where: whereCondition,
            limit: limitNum,
            offset: offset
        };
        
        // Add sorting dynamically if orderBy exists
        if (orderBy) {
            options.order = [[orderBy, order?.toUpperCase() || "ASC"]]; // Default to ASC if order is missing
        }
        
    
        // Fetch data with pagination, filtering, and sorting
        const { count, rows } = await Model.findAndCountAll(options);
    
        return res.status(200).json({
          totalRecords: count,
          totalPages: Math.ceil(count / limitNum),
          currentPage: pageNum,
          data: rows
        });
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ message: "Server Error", error: error.message });
      }
};


