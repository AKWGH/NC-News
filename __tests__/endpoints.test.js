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
  describe('testing invalid paths handler', () => {
    it('should respond with a status 404 and msg', () => {
      return request(app)
        .get('/api/invalid-path')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Sorry, path not found');
        });
    });
  });

  describe('GET /api/topics', () => {
    it('should respond with a status 200 and array of objects containing all topics data', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;

          expect(topics.length).toBe(3);
          // testing individual properties on objects
          topics.forEach((topic) => {
            expect(topic).toHaveProperty('slug', expect.any(String));
            expect(topic).toHaveProperty('description', expect.any(String));
          });
        });
    });
  });
  describe('GET /api/articles', () => {
    it('should respond with a status 200 and array of objects containing all articles data', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(12);

          // testing individual properties on articles
          articles.forEach((article) => {
            expect(article).toHaveProperty('article_id', expect.any(Number));
            expect(article).toHaveProperty('title', expect.any(String));
            expect(article).toHaveProperty('topic', expect.any(String));
            expect(article).toHaveProperty('author', expect.any(String));
            expect(article).toHaveProperty('body', expect.any(String));
            expect(article).toHaveProperty('created_at', expect.any(String));
            expect(article).toHaveProperty('votes', expect.any(Number));
            expect(article).toHaveProperty(
              'article_img_url',
              expect.any(String)
            );
            expect(article).toHaveProperty('comment_count', expect.any(Number));
          });
        });
    });
  });
});
