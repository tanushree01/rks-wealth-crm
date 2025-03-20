const { getAll } = require("../utiles/getAll");

const table = 'transaction_90days';

exports.get90DaysTransaction = async (req, res) => {
return getAll(req, res, table);
};


