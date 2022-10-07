import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import prisma from '../utils/prisma.js';
import app from '../app.js';
import { superAdminUser, basicUser, adminUser } from './users.js';

chai.use(chaiHttp);

const BASE_URL = '/api/v1';

describe('Users', () => {
  it('should not allow viewing of user profiles due to insufficient authorisation', (done) => {
    // const test = prisma.user.findFirst({
    //     where: {
    //       role: 'BASIC_USER',
    //     },
    //   });
    //   console.log('test', test)
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
          .get(`${BASE_URL}/users`)
          .auth(loginRes.body.token, {
            type: 'bearer',
          })
          .end((__, quizRes) => {
            chai.expect(quizRes.status).to.be.equal(403);
            chai
              .expect(quizRes.body.msg)
              .to.be.equal('You are not authorized to perform this action');
            done();
          });
      });
  });

  it('should display all user profiles to Super admin user', (done) => {
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
          .get(`${BASE_URL}/users`)
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

  it('should display user profiles to admin user', (done) => {
    const { email, password } = adminUser;
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
          .get(`${BASE_URL}/users`)
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
});
