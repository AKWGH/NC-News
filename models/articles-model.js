const db = require('../db/connection');

const selectArticles = () => {
  // selects the data from the articles Table
  return db
    .query(
      `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id ORDER BY created_at;`
    )
    .then((data) => {
      // map over data changing the string value to a number
      const correctArticleData = data.rows.map((article) => {
        // copy of data
        const articleCopy = { ...article };
        // change the key of comment_count to a number
        articleCopy.comment_count = +articleCopy.comment_count;
        return articleCopy;
      });
      return correctArticleData;
    });
};

module.exports = { selectArticles };
