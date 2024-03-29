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
            // testing that the articles array is sorted with jest-sorted by date descending order
            expect(articles).toBeSorted({
              key: 'created_at',
              descending: true,
            });
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
  describe('GET /api/articles/:article_id/comments', () => {
    it('should respond with a status 200 and respond with an array of all columns for the selected article', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;

          // test to check the length of comments array is as expected
          expect(comments.length).toBe(11);
          // test to check the object has all the correct properties and data
          comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: expect.any(Number),
            });
          });
          // testing that the comments array is sorted with jest-sorted
          expect(comments).toBeSorted({ key: 'created_at', descending: true });
        });
    });
    it('should respond with a status 400 and a bad request error message', () => {
      return request(app)
        .get('/api/articles/banana/comments')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
    });
    it('should respond with a status 200 but contain no comments in the array', () => {
      return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual({ comments: [] });
        });
    });
    it('should respond with a status 404 Sorry, no article found', () => {
      return request(app)
        .get('/api/articles/10000/comments')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Sorry, no article found');
        });
    });
  });
  describe('POST /api/articles/:article_id/comments', () => {
    it('should respond with a status 201 and the posted comment', () => {
      return request(app)
        .post('/api/articles/2/comments')
        .send({ username: 'butter_bridge', body: 'Posting a new comment' })
        .expect(201)
        .then(({ body }) => {
          expect(body.comment[0]).toEqual({
            article_id: 2,
            author: 'butter_bridge',
            body: 'Posting a new comment',
            comment_id: 19,
            created_at: expect.any(String),
            votes: 0,
          });
          // test to see if it updated in database
          return request(app)
            .get('/api/articles/2/comments')
            .expect(200)
            .then(({ body }) => {
              // before post request the length was 0
              expect(body.comments.length).toBe(1);
            });
        });
    });
    //test incorrect datatype in request body
    it('should respond with a status 400 Bad request ', () => {
      return request(app)
        .post('/api/articles/banana/comments')
        .send({ username: 'butter_bridge', body: 'Posting a new comment' })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
    });
    //test malformed request missing notnull values
    it('should respond with a status 400 Malformed request', () => {
      return request(app)
        .post('/api/articles/2/comments')
        .send({ username: 'butter_bridge' })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Malformed request');
        });
    });
    it('should respond with a 404 not found Invalid username as the username andy does not exist in the database', () => {
      return request(app)
        .post('/api/articles/2/comments')
        .send({ username: 'andy', body: 'Hello world' })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid username');
        });
    });
    it('should respond with a 404 no article found', () => {
      return request(app)
        .post('/api/articles/1000/comments')
        .send({ username: 'butter_bridge', body: 'Posting a new comment' })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Sorry, no article found');
        });
    });
  });
  describe('PATCH /api/articles/:article_id', () => {
    it('should respond with 200 and update the articles votes', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body }) => {
          expect(body.updatedArticle[0].votes).toBe(101);
        });
    });
    it('should respond with 200 and be able to decrement the votes count', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: -25 })
        .expect(200)
        .then(({ body }) => {
          expect(body.updatedArticle[0].votes).toBe(75);
        });
    });
    it('should respond with a status 400 malformed request when not sent the correct data in the body', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ wrongData: 'hello' })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Malformed request');
        });
    });
    it('should respond with a status 400 Bad request when the path is bad', () => {
      return request(app)
        .patch('/api/articles/banana')
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
    });
    it('should respond with a 404 Sorry, no article found when the article does not exist', () => {
      return request(app)
        .patch('/api/articles/10000')
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Sorry, no article found');
        });
    });
    it('should respond with a 400 Bad request when incorrect datatype in request body', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 'banana' })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
    });
  });
  describe('GET /api/users', () => {
    it('should respond with 200 and an array of all the users in the database', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
          const { users } = body;
          expect(users.length).toBe(4);

          users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });
  describe('GET /api/articles/? queryString', () => {
    it('should respond with status 200 and have the data sorted by votes', () => {
      return request(app)
        .get('/api/articles/?sort_by=votes')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSorted({
            key: 'votes',
            descending: true,
          });
        });
    });
    it('should respond with 200 and and have the data sorted by author and ascending order', () => {
      return request(app)
        .get('/api/articles/?sort_by=author&order=asc')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSorted({
            key: 'author',
            descending: false,
          });
        });
    });
    it('should respind with 200 and have the data filtered by topic', () => {
      return request(app)
        .get('/api/articles/?topic=cats')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(1);
        });
    });
    it('should respond with 200 and have the data filtered by topic sorted by author in asc order', () => {
      return request(app)
        .get('/api/articles/?sort_by=author&topic=mitch&order=asc')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(11);
          expect(articles).toBeSorted({
            key: 'author',
            descending: false,
          });
        });
    });
    it('should respond with 200 but show an empty array as the topic filter has no matches but still a valid search query', () => {
      return request(app)
        .get('/api/articles/?topic=banana')
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual({ articles: [] });
        });
    });
    it('should respond with a 400 Invalid sort query', () => {
      return request(app)
        .get('/api/articles/?sort_by=gkjehe')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid sort query');
        });
    });
    it('should respond with a 400 Invalid order query', () => {
      return request(app)
        .get('/api/articles/?order=gkjehe')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Invalid order query');
        });
    });
  });
  describe('GET /api/articles/:article_id refactor', () => {
    it('should respond with 200 and have the new comment_count value in the response object', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article[0]).toMatchObject({
            article_id: 1,
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
    });
  });
  describe('DELETE /api/comments/:comment_id', () => {
    it('should respond with a 204 and delete the comment from the database', () => {
      return request(app).delete('/api/comments/2').expect(204);
    });
    it('should respond with 404 when comment does not exist in the database', () => {
      return request(app)
        .delete('/api/comments/2000')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('comment not found');
        });
    });
    it('should respond with a 400 bad request', () => {
      return request(app)
        .delete('/api/comments/banana')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
    });
  });
});
