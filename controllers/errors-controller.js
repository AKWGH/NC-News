const invalidPathError = (req, res, next) => {
  res.status(404).send({ msg: 'Sorry, path not found' });
};

const handleCustomErrors = (err, req, res, next) => {
  if (err === 'Sorry, no article found') {
    res.status(404).send({ msg: err });
  }
  if (err === 'Invalid username') {
    res.status(404).send({ msg: err });
  }
  if (err === 'Invalid sort query') {
    res.status(400).send({ msg: err });
  }
  if (err === 'Invalid order query') {
    res.status(400).send({ msg: err });
  }
  //passed the err to the next middleware
  next(err);
};

const handlePSQLErrors = (err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad request' });
  }
  if (err.code === '23502') {
    res.status(400).send({ msg: 'Malformed request' });
  }
};

module.exports = { invalidPathError, handleCustomErrors, handlePSQLErrors };
