const invalidPathError = (req, res, next) => {
  res.status(404).send({ msg: 'Sorry, path not found' });
};

module.exports = { invalidPathError };
