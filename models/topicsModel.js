const db = require('../db/connection');

const selectTopics = () => {
  // selects the data from the topics TABLE
  return db.query(`SELECT * FROM topics;`).then((data) => {
    // returns the row property which contains the data from the SELECT request
    return data.rows;
  });
};

module.exports = { selectTopics };
