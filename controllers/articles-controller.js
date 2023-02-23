// models
const comments = require('../db/data/test-data/comments');
const {
  selectArticles,
  selectIndividualArticle,
  selectArticleComments,
  articleExists,
  insertIntoComments,
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

const sendArticleComments = (req, res, next) => {
  const { article_id } = req.params;

  // promise variables
  const selectArticleCommentsPromise = selectArticleComments(article_id);
  const articleExistsPromise = articleExists(article_id);

  Promise.all([selectArticleCommentsPromise, articleExistsPromise])
    .then((values) => {
      // grabs article data if articleExists doesn't reject
      const comments = values[0];
      res.status(200).send({ comments });
    })
    // catches articleExists reject Promise
    .catch((err) => {
      next(err);
    });
};

const postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  insertIntoComments(article_id, body, username)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
module.exports = {
  sendArticles,
  sendIndividualArticle,
  sendArticleComments,
  postComment,
};
