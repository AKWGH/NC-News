const db = require('../db/connection');

const selectUsers = () => {
  // selects all the users in the database
  return db.query(`SELECT * FROM users;`).then((data) => {
    return data.rows;
  });
};

module.exports = { selectUsers };
