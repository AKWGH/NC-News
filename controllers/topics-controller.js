// models
const { selectTopics } = require('../models/topicsModel');
// controller functions
const sendTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      return res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

// exporting functions
module.exports = { sendTopics };
