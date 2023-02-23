const { selectUsers } = require('../models/users-model');

const sendUsers = (req, res) => {
  selectUsers().then((data) => {
    const users = data;
    res.status(200).send({ users });
  });
};

module.exports = { sendUsers };
