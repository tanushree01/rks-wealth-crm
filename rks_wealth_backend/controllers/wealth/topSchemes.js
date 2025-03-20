const { getAll } = require("../utiles/getAll");

const table = 'top_schemes';

exports.getTopSchemes = async (req, res) => {
return getAll(req, res, table);
};


