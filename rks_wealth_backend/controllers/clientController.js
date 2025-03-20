const { getAll } = require("./utiles/getAll");

const table = 'client_diary';

exports.getClientDiaries = async (req, res) => {
return getAll(req, res, table);
};


