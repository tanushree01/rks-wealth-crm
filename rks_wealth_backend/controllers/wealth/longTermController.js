const { getAll } = require("../utiles/getAll");

const table = 'long_term';

exports.getLongTerm = async (req, res) => {
return getAll(req, res, table);
};

