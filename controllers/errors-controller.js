const invalidPathError = (req, res, next) => {
  res.status(404).send({ msg: 'Sorry, path not found' });
};

const handleCustomErrors = (err, req, res, next) => {
  if (err === 'Sorry, no article found') {
    res.status(404).send({ msg: err });
  } else if (err === 'article does not exist') {
    res.status(200).send({ msg: err });
  }
  //passed the err to the next middleware
  next(err);
};

const handlePSQLErrors = (err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad request' });
  }
};

module.exports = { invalidPathError, handleCustomErrors, handlePSQLErrors };
