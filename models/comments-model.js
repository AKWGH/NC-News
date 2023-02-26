const db = require('../db/connection');

const findCommentToDelete = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING * `, [
      comment_id,
    ])
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject('comment not found');
      }
    });
};

module.exports = { findCommentToDelete };
