const db = require('../db/connection');

const selectArticles = (topic, sort_by = 'created_at', order = 'desc') => {
  // potential options to check its valid
  const sortByOptions = [
    'title',
    'topic',
    'author',
    'body',
    'votes',
    'created_at',
  ];
  const orderOptions = ['asc', 'desc'];
  // checks to see if sort and order querys are valid otherwise throws an error
  if (!sortByOptions.includes(sort_by)) {
    return Promise.reject('Invalid sort query');
  }
  if (!orderOptions.includes(order)) {
    return Promise.reject('Invalid order query');
  }
  let queryStr = `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

  return db.query(queryStr).then((data) => {
    // checks to see if we are filtering data by topic
    let filter = data.rows;
    if (topic) {
      filter = filter.filter((article) => {
        return article.topic.includes(topic);
      });
    }

    // map over data changing the string value to a number
    const correctArticleData = filter.map((article) => {
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
  return db
    .query(`SELECT * FROM users WHERE users.username = $1`, [username])
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject('Invalid username');
      }
    });
};

const updateArticleVoteCount = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles SET votes = articles.votes + $1 WHERE article_id = $2 RETURNING *`,
      [inc_votes, article_id]
    )
    .then((data) => {
      return data.rows;
    });
};

module.exports = {
  selectArticles,
  selectIndividualArticle,
  selectArticleComments,
  articleExists,
  insertIntoComments,
  usernameExists,
  updateArticleVoteCount,
};

// `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
//     FROM articles
//     LEFT JOIN comments ON articles.article_id = comments.article_id
//     GROUP BY articles.article_id ORDER BY created_at;`
