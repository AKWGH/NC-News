// require express package
const express = require('express');
//controllers
const { sendTopics } = require('./controllers/topics-controller');
const {
  sendArticles,
  sendIndividualArticle,
  sendArticleComments,
  postComment,
} = require('./controllers/articles-controller');
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

// handles invalid path
app.use(invalidPathError);
// handles custom errors
app.use(handleCustomErrors);
// handles psql errors
app.use(handlePSQLErrors);

// app listener listening for requests
// app.listen(9090, () => {
//   console.log('listening on 9090');
// });

module.exports = app;
