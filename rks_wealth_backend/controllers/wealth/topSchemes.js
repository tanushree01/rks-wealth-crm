const { getAll } = require("../utiles/getAll");

const table = "top_scheme";

exports.getTopSchemes = async (req, res) => {
  return getAll(req, res, table, "SCHEMES");
};
