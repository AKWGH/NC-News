// require express package
const express = require('express');
//controllers
const { sendTopics } = require('./controllers/topics-controller');

// initialises express server
const app = express();

// GET req
app.get('/api/topics', sendTopics);

//errors
app.use((err, req, res, next) => {
  console.log(err);
});
// app listener listening for requests
// app.listen(9090, () => {
//   console.log('listening on 9090');
// });

module.exports = app;
