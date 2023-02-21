// models
const { selectArticles } = require('../models/articles-model');

// controller functions
const sendArticles = (req, res) => {
  selectArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

module.exports = { sendArticles };
