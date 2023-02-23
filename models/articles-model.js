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

const selectIndividualArticle = (article_id) => {
  // selects the individual article data
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((data) => {
      // rejects promise as no article data exists
      if (data.rows.length === 0) {
        return Promise.reject('Sorry, no article found');
      }
      // article data exists so it sends a response
      return data.rows;
    });
};

const selectArticleComments = (article_id) => {
  // selects the comments data for specified article
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at`, [
      article_id,
    ])
    .then((data) => {
      return data.rows;
    });
};

// function to check if the article exists throws an error if not
const articleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((data) => {
      // rejected Promise if data does not contain anything
      if (data.rows.length === 0) {
        return Promise.reject('Sorry, no article found');
      }
    });
};

const insertIntoComments = (article_id, body, username) => {
  // inserts into comments TABLE
  return db
    .query(
      `INSERT INTO comments (body,author,article_id)
    VALUES ($1,$2,$3) RETURNING *;`,
      [body, username, article_id]
    )
    .then((data) => {
      return data.rows;
    });
};

const usernameExists = (username) => {
  console.log(username);
  return db
    .query(`SELECT * FROM users WHERE users.username = $1`, [username])
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject('Invalid username');
      }
    });
};

module.exports = {
  selectArticles,
  selectIndividualArticle,
  selectArticleComments,
  articleExists,
  insertIntoComments,
  usernameExists,
};
