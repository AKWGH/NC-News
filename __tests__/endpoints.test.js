const request = require('supertest');
const app = require('../app');

// seed function to seed the test database
const seed = require('../db/seeds/seed');

// testing data
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require('../db/data/test-data/index');
const connection = require('../db/connection');
// seed invoked with all the test data
beforeEach(() => {
  return seed({ topicData, userData, articleData, commentData });
});

afterAll(() => {
  return connection.end();
});

describe('app endpoint tests', () => {
  describe('GET /api/topics', () => {
    it('should respond with a status 200 and array of objects containing all topics data', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;
          console.log(topics);

          expect(topics.length).toBe(3);
          // testing individual properties on objects
          topics.forEach((topic) => {
            expect(topic).toHaveProperty('slug', expect.any(String));
            expect(topic).toHaveProperty('description', expect.any(String));
          });
        });
    });
  });
});
