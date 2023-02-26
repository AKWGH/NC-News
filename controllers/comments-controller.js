// models
const { findCommentToDelete } = require('../models/comments-model');

// controller functions
const deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  findCommentToDelete(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { deleteComment };
