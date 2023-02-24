// models
const comments = require('../db/data/test-data/comments');
const {
  selectArticles,
  selectIndividualArticle,
  selectArticleComments,
  articleExists,
  insertIntoComments,
  usernameExists,
  updateArticleVoteCount,
} = require('../models/articles-model');

// controller functions
const sendArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.query;
  console.log(topic, sort_by, order);
  selectArticles(topic, sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      console.log(err);
      next(err);
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

  const usernameExistsPromise = usernameExists(username);
  const articleExistsPromise = articleExists(article_id);
  const insertIntoCommentsPromise = insertIntoComments(
    article_id,
    body,
    username
  );

  Promise.all([
    insertIntoCommentsPromise,
    usernameExistsPromise,
    articleExistsPromise,
  ])
    .then((values) => {
      const comment = values[0];
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

const updateArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  // updates the selected article votes property with the passed votes value

  const articleExistsPromise = articleExists(article_id);
  const updateArticleVoteCountPromise = updateArticleVoteCount(
    article_id,
    inc_votes
  );
  Promise.all([updateArticleVoteCountPromise, articleExistsPromise])
    .then((values) => {
      const updatedArticle = values[0];
      res.status(200).send({ updatedArticle });
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
  updateArticleVotes,
};
