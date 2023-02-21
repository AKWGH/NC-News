// models
const {
  selectArticles,
  selectIndividualArticle,
} = require('../models/articles-model');

// controller functions
const sendArticles = (req, res) => {
  selectArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

const sendIndividualArticle = (req, res, next) => {
  const { article_id } = req.params;

  selectIndividualArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { sendArticles, sendIndividualArticle };
