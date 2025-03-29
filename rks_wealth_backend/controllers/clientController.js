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
        let whereConditions = {};
        Object.keys(filters).forEach(key => {
          if (filters[key]) {
            whereConditions[key] = { [Op.iLike]: `%${filters[key]}%` }; // Case-insensitive search
          }
        });

        const userType = req.user.userType;
        if (userType === "RM" || userType === "SRM") {
          whereConditions[userType] = req.user.userName;
        }

        let options = {
            where: whereConditions,
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
      let whereConditions = {};
      if (IWELL_CODE) whereConditions.IWELL_CODE = { [Op.iLike]: `%${IWELL_CODE}%` };
      
      const userType = req.user.userType;
      if (userType === "RM" || userType === "SRM") {
        whereConditions[userType] = req.user.userName;
      }

      // Fetch the first matching client diary
      const clientDiary = await Model.findOne({
          where: whereConditions,
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
exports.downloadClientDiary = async (req, res) => {
  try {
      const { IWELL_CODE } = req.query;
      const Model = await getModel(table);

      // Ensure at least one of the required filters is provided
      if (!IWELL_CODE) {
          return res.status(400).json({ message: "IWELL_CODE is required" });
      }

      // Create filtering conditions dynamically
      let whereConditions = {};
      if (IWELL_CODE) whereConditions.IWELL_CODE = { [Op.iLike]: `%${IWELL_CODE}%` };

      const userType = req.user.userType;
      if (userType === "RM" || userType === "SRM") {
        whereConditions[userType] = req.user.userName;
      }

      // Fetch the first matching client diary
      const clientDiary = await Model.findOne({
          where: whereConditions,
          attributes: { exclude: ["id"] }, // Exclude ID
      });

      // If no record found
      if (!clientDiary) {
          return res.status(404).json({ message: "Client diary not found" });
      }
      const rowData = clientDiary.get({ plain: true });
      const workbook = await generateExcelFile([rowData]);
      // Write to response
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=client_dairy_${(rowData.NAME || "").replace(" ","_")}.xlsx`
      );
  
      await workbook.xlsx.write(res);
      res.end();
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
      let whereConditions = {};
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          whereConditions[key] = { [Op.iLike]: `%${filters[key]}%` }; // Case-insensitive search
        }
      });

      const userType = req.user.userType;
      if (userType === "RM" || userType === "SRM") {
        whereConditions[userType] = req.user.userName;
      }

      let options = {
          where: whereConditions,
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
      const plainRows = rows.map((row) => row.get({ plain: true }));
  
      const workbook = await generateExcelFile(plainRows);
      // Write to response
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=client_dairy_records.xlsx"
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
