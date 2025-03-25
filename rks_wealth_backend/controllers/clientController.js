const { Op, Sequelize } = require("sequelize");
const { getModel } = require("../models");
const generateExcelFile = require("../service/generateExcelFile");

const table = 'client_diary';

exports.getClientDiaries = async (req, res) => {
    try {
        const {
          page = 1,
          limit = 10,
          orderBy,
          order = "ASC",
          distinct,  
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

        let options = {
            where: whereCondition,
            limit: limitNum,
            offset: offset
        };

        // Get model attributes correctly
        const modelAttributes = Object.keys(Model.getAttributes());

        // Conditionally apply DISTINCT ON (FAMILY_HEAD)
        if (distinct === "true") {
          options.attributes = [
              [Sequelize.literal('DISTINCT ON ("FAMILY_HEAD") "FAMILY_HEAD"'), 'FAMILY_HEAD'],
              ...modelAttributes
                  .filter(attr => attr !== "FAMILY_HEAD" && attr !== "id") // Exclude "id"
                  .map(attr => [Sequelize.col(attr), attr])
          ];
      } else {
          options.attributes = { exclude: ["id"] };
      }
      

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




exports.getClientDiary = async (req, res) => {
  try {
      const { IWELL_CODE } = req.query;
      const Model = await getModel(table);

      // Ensure at least one of the required filters is provided
      if (!IWELL_CODE) {
          return res.status(400).json({ message: "IWELL_CODE is required" });
      }

      // Create filtering conditions dynamically
      let whereCondition = {};
      if (IWELL_CODE) whereCondition.IWELL_CODE = { [Op.iLike]: `%${IWELL_CODE}%` };

      // Fetch the first matching client diary
      const clientDiary = await Model.findOne({
          where: whereCondition,
          attributes: { exclude: ["id"] }, // Exclude ID
      });

      // If no record found
      if (!clientDiary) {
          return res.status(404).json({ message: "Client diary not found" });
      }

      return res.status(200).json(clientDiary);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error", error: error.message });
  }
};




exports.downloadClientDiaries = async (req, res) => {
  try {
      const {
        orderBy,
        order = "ASC",
        distinct,  
        ...filters
      } = req.query;
      const Model = await getModel(table);

  
      // Prepare filtering conditions
      let whereCondition = {};
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          whereCondition[key] = { [Op.iLike]: `%${filters[key]}%` }; // Case-insensitive search
        }
      });

      let options = {
          where: whereCondition,
      };

      // Get model attributes correctly
      const modelAttributes = Object.keys(Model.getAttributes());

      // Conditionally apply DISTINCT ON (FAMILY_HEAD)
      if (distinct === "true") {
        options.attributes = [
            [Sequelize.literal('DISTINCT ON ("FAMILY_HEAD") "FAMILY_HEAD"'), 'FAMILY_HEAD'],
            ...modelAttributes
                .filter(attr => attr !== "FAMILY_HEAD" && attr !== "id") // Exclude "id"
                .map(attr => [Sequelize.col(attr), attr])
        ];
    } else {
        options.attributes = { exclude: ["id"] };
    }
    

      // Add sorting dynamically if orderBy exists
      if (orderBy) {
          options.order = [[orderBy, order?.toUpperCase() || "ASC"]]; // Default to ASC if order is missing
      }
      
  
      // Fetch data with pagination, filtering, and sorting
      const { count, rows } = await Model.findAndCountAll(options);

      if (count === 0) {
        return res
          .status(404)
          .json({ message: "No records found matching." });
      }
  
      const workbook = await generateExcelFile(rows);
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
      console.error(error);
      return res
        .status(500)
        .json({ message: "Server Error", error: error.message });
    }
};
