const { getAll } = require("../utiles/getAll");

const table = 'folio_master';

exports.getFolioMaster = async (req, res) => {
return getAll(req, res, table);
};

