const ExcelJS = require('exceljs');
async function generateExcelFile(records) {
    if (records.length === 0) {
      throw new Error("No records found matching the given criteria.");
    }
  
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Folio Master Records');
  
    worksheet.columns = Object.keys(records[0]).map(key => ({ header: key, key }));
    records.forEach(row => worksheet.addRow(row));
  
    return workbook;
  }

  module.exports = generateExcelFile;