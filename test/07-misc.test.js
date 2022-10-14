import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../app.js';
import { basicUser } from './users.js';

chai.use(chaiHttp);

const BASE_URL = '/api/v1';

describe('A few extra bits and pieces', () => {
  it('should show all endpoints', (done) => {
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
          .get(`${BASE_URL}/`)
          .auth(loginRes.body.token, {
            type: 'bearer',
          })
          .end((__, quizRes) => {
            chai.expect(quizRes.status).to.be.equal(200);
            chai.expect(quizRes.body).to.be.a('object');
            chai.expect(quizRes.body.msg).to.be.equal('Endpoints successfully collected');
            done();
          });
      });
  });

  it('should show all endpoints', (done) => {
    const { email, password } = basicUser;
    const token = 'This.is.not.a.real.token';
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
          .get(`${BASE_URL}/`)
          .auth(token, {
            type: 'bearer',
          })
          .end((__, quizRes) => {
            chai.expect(quizRes.status).to.be.equal(403);
            chai.expect(quizRes.body).to.be.a('object');
            chai.expect(quizRes.body.msg).to.be.equal('Not authorized to access this route');
            done();
          });
      });
  });

  it('should reject request due to no token being provided', (done) => {
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
          .get(`${BASE_URL}/`)
          .end((__, quizRes) => {
            chai.expect(quizRes.status).to.be.equal(403);
            chai.expect(quizRes.body).to.be.a('object');
            chai.expect(quizRes.body.msg).to.be.equal('No token provided');
            done();
          });
      });
  });
});
