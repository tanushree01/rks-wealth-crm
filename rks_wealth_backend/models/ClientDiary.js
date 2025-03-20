const { getModel } = require("./index");

async function getClientDiaryModel() {
  return await getModel("client_diary");
}

module.exports = { getClientDiaryModel };
