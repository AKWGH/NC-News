const request = require('supertest');
require('jest-sorted');

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
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
            // testing that the articles array is sorted with jest-sorted
            expect(articles).toBeSorted({ key: 'created_at' });
          });
        });
    });
  });
  describe('GET /api/articles/:article_id', () => {
    it('should respond with a status 200 and an article object containing a specific article', () => {
      return request(app)
        .get('/api/articles/4')
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          // tests we recieve a single article
          expect(article.length).toBe(1);
          // tests we recieve the correct data
          expect(article[0]).toMatchObject({
            article_id: 4,
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
    });
    it('should respond with a status 404 and an error message', () => {
      return request(app)
        .get('/api/articles/100')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe(`Sorry, no article found`);
        });
    });
    it('should respond with a status 400 and a bad request error message', () => {
      return request(app)
        .get('/api/articles/banana')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
    });
  });
});
