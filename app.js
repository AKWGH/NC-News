// require express package
const express = require('express');
//controllers
const { sendTopics } = require('./controllers/topics-controller');
const { sendArticles } = require('./controllers/articles-controller');
const { invalidPathError } = require('./controllers/errors-controller');

// initialises express server
const app = express();

// requests
app.get('/api/topics', sendTopics);

app.get('/api/articles', sendArticles);

// handles invalid path
app.use(invalidPathError);

// app listener listening for requests
// app.listen(9090, () => {
//   console.log('listening on 9090');
// });

module.exports = app;
