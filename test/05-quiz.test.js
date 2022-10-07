import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../app.js';
import { superAdminUser, basicUser } from './users.js';
import { dateFormat } from '../utils/misc.js';

chai.use(chaiHttp);

const BASE_URL = '/api/v1';

const start = dateFormat(1);
const end = dateFormat(3);

const quiz = {
  id: 1,
  name: 'newQuizTest',
  categoryid: 12,
  type: 'multiple',
  difficulty: 'medium',
  start_date: start,
  end_date: end,
};

describe('Quizzes', () => {
  it('should create quiz', (done) => {
    const { email, password } = superAdminUser;
    chai
      .request(app)
      .post(`${BASE_URL}/auth/login`)
      .send({
        email,
        password,
      })
      .end((_, loginRes) => {
        chai
          .request(app)
          .post(`${BASE_URL}/quizzes`)
          .auth(loginRes.body.token, {
            type: 'bearer',
          })
          .send(quiz)
          .end((__, quizRes) => {
            chai.expect(quizRes.status).to.be.equal(201);
            chai.expect(quizRes.body).to.be.a('object');
            chai.expect(quizRes.body.msg).to.be.equal('quiz successfully created');
            done();
          });
      });
  });

  it('should rate quiz', (done) => {
    const { email, password } = basicUser;
    const rating = {
      rating: 8,
    };
    chai
      .request(app)
      .post(`${BASE_URL}/auth/login`)
      .send({
        email,
        password,
      })
      .end((_, loginRes) => {
        chai
          .request(app)
          .post(`${BASE_URL}/quizzes/1/rate`)
          .auth(loginRes.body.token, {
            type: 'bearer',
          })
          .send(rating)
          .end((__, quizRes) => {
            chai.expect(quizRes.status).to.be.equal(201);
            chai.expect(quizRes.body).to.be.a('object');
            chai.expect(quizRes.body.msg).to.be.equal('Rating for quiz 1 successfully added');
            done();
          });
      });
  });

  it('should reject quiz creation due to quiz lasting more than 5 days', (done) => {
    const { email, password } = superAdminUser;
    quiz.end_date = dateFormat(10);
    chai
      .request(app)
      .post(`${BASE_URL}/auth/login`)
      .send({
        email,
        password,
      })
      .end((_, loginRes) => {
        chai
          .request(app)
          .post(`${BASE_URL}/quizzes`)
          .auth(loginRes.body.token, {
            type: 'bearer',
          })
          .send(quiz)
          .end((__, quizRes) => {
            chai.expect(quizRes.status).to.be.equal(400);
            chai.expect(quizRes.body).to.be.a('object');
            chai
              .expect(quizRes.body.msg)
              .to.be.equal(
                'End date must be greater than the start date & no longer than five days',
              );
            done();
          });
      });
  });

  it('should reject quiz creation due to quiz start date being before current date', (done) => {
    const { email, password } = superAdminUser;
    quiz.start_date = dateFormat(-1);
    chai
      .request(app)
      .post(`${BASE_URL}/auth/login`)
      .send({
        email,
        password,
      })
      .end((_, loginRes) => {
        chai
          .request(app)
          .post(`${BASE_URL}/quizzes`)
          .auth(loginRes.body.token, {
            type: 'bearer',
          })
          .send(quiz)
          .end((__, quizRes) => {
            chai.expect(quizRes.status).to.be.equal(400);
            chai.expect(quizRes.body).to.be.a('object');
            chai
              .expect(quizRes.body.msg)
              .to.be.equal("start date must be greater than today's date");
            done();
          });
      });
  });

  it('should reject quiz creation due to insufficient authorisation', (done) => {
    const { email, password } = basicUser;
    quiz.start_date = dateFormat(1);
    quiz.end_date = dateFormat(3);
    chai
      .request(app)
      .post(`${BASE_URL}/auth/login`)
      .send({
        email,
        password,
      })
      .end((_, loginRes) => {
        chai
          .request(app)
          .post(`${BASE_URL}/quizzes`)
          .auth(loginRes.body.token, {
            type: 'bearer',
          })
          .send(quiz)
          .end((__, quizRes) => {
            chai.expect(quizRes.status).to.be.equal(401);
            chai.expect(quizRes.body.msg).to.be.equal('not authorised to perform this action');
            done();
          });
      });
  });

  it('should reject quiz creation due to incorrect name format', (done) => {
    const { email, password } = superAdminUser;
    quiz.start_date = dateFormat(1);
    quiz.end_date = dateFormat(3);
    quiz.name = 'qu@z name';
    chai
      .request(app)
      .post(`${BASE_URL}/auth/login`)
      .send({
        email,
        password,
      })
      .end((_, loginRes) => {
        chai
          .request(app)
          .post(`${BASE_URL}/quizzes`)
          .auth(loginRes.body.token, {
            type: 'bearer',
          })
          .send(quiz)
          .end((__, quizRes) => {
            chai.expect(quizRes.status).to.be.equal(400);
            chai
              .expect(quizRes.body.msg)
              .to.be.equal('quiz name must contain alpha characters only');
            done();
          });
      });
  });

  it('should display all quizzes to user', (done) => {
    const { email, password } = superAdminUser;
    chai
      .request(app)
      .post(`${BASE_URL}/auth/login`)
      .send({
        email,
        password,
      })
      .end((_, loginRes) => {
        chai
          .request(app)
          .get(`${BASE_URL}/quizzes`)
          .auth(loginRes.body.token, {
            type: 'bearer',
          })
          .end((__, quizRes) => {
            chai.expect(quizRes.status).to.be.equal(200);
            chai.expect(quizRes.body).to.be.a('object');
            done();
          });
      });
  });

  it('should display single quiz to user', (done) => {
    const { email, password } = basicUser;
    chai
      .request(app)
      .post(`${BASE_URL}/auth/login`)
      .send({
        email,
        password,
      })
      .end((_, loginRes) => {
        chai
          .request(app)
          .get(`${BASE_URL}/quizzes/1`)
          .auth(loginRes.body.token, {
            type: 'bearer',
          })
          .end((__, quizRes) => {
            chai.expect(quizRes.status).to.be.equal(200);
            chai.expect(quizRes.body).to.be.a('object');
            done();
          });
      });
  });

  it('should display future quizzes to user', (done) => {
    const { email, password } = basicUser;
    chai
      .request(app)
      .post(`${BASE_URL}/auth/login`)
      .send({
        email,
        password,
      })
      .end((_, loginRes) => {
        chai
          .request(app)
          .get(`${BASE_URL}/quizzes/get/future`)
          .auth(loginRes.body.token, {
            type: 'bearer',
          })
          .end((__, quizRes) => {
            chai.expect(quizRes.status).to.be.equal(200);
            chai.expect(quizRes.body).to.be.a('object');
            done();
          });
      });
  });

  it('should not delete quizzes due to insufficient authorisation', (done) => {
    const { email, password } = basicUser;
    chai
      .request(app)
      .post(`${BASE_URL}/auth/login`)
      .send({
        email,
        password,
      })
      .end((_, loginRes) => {
        chai
          .request(app)
          .delete(`${BASE_URL}/quizzes/1`)
          .auth(loginRes.body.token, {
            type: 'bearer',
          })
          .end((__, quizRes) => {
            chai.expect(quizRes.status).to.be.equal(401);
            chai.expect(quizRes.body.msg).to.be.equal('not authorised to perform this action');
            done();
          });
      });
  });

  it('should return error due to attempt to delete non existent quiz', (done) => {
    const { email, password } = superAdminUser;
    chai
      .request(app)
      .post(`${BASE_URL}/auth/login`)
      .send({
        email,
        password,
      })
      .end((_, loginRes) => {
        chai
          .request(app)
          .delete(`${BASE_URL}/quizzes/2`)
          .auth(loginRes.body.token, {
            type: 'bearer',
          })
          .end((__, quizRes) => {
            chai.expect(quizRes.status).to.be.equal(200);
            chai.expect(quizRes.body.msg).to.be.equal('No quiz with the id 2 found');
            done();
          });
      });
  });

  it('should delete quiz specified by user', (done) => {
    const { email, password } = superAdminUser;
    chai
      .request(app)
      .post(`${BASE_URL}/auth/login`)
      .send({
        email,
        password,
      })
      .end((_, loginRes) => {
        chai
          .request(app)
          .delete(`${BASE_URL}/quizzes/1`)
          .auth(loginRes.body.token, {
            type: 'bearer',
          })
          .end((__, quizRes) => {
            chai.expect(quizRes.status).to.be.equal(200);
            chai.expect(quizRes.body.msg).to.be.equal('quiz with the id 1 successfully deleted');
            done();
          });
      });
  });
});
