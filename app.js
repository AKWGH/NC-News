// require express package
const express = require('express');

//controllers
const { sendTopics } = require('./controllers/topics-controller');

// articles controller
const {
  sendArticles,
  sendIndividualArticle,
  sendArticleComments,
  postComment,
  updateArticleVotes,
} = require('./controllers/articles-controller');

// comments controller
const { deleteComment } = require('./controllers/comments-controller');

// users controller
const { sendUsers } = require('./controllers/users-controller');

// errors-controller
const {
  invalidPathError,
  handleCustomErrors,
  handlePSQLErrors,
} = require('./controllers/errors-controller');

// initialises express server
const app = express();

app.use(express.json());

// requests
app.get('/api/topics', sendTopics);

app.get('/api/articles', sendArticles);

app.get('/api/articles/:article_id', sendIndividualArticle);

app.get('/api/articles/:article_id/comments', sendArticleComments);

app.post('/api/articles/:article_id/comments', postComment);

app.patch('/api/articles/:article_id', updateArticleVotes);

app.get('/api/users', sendUsers);

app.delete('/api/comments/:comment_id', deleteComment);

// handles invalid path
app.use(invalidPathError);
// handles custom errors
app.use(handleCustomErrors);
// handles psql errors
app.use(handlePSQLErrors);

module.exports = app;
