import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../app.js';
import { superAdminUser } from './users.js';

chai.use(chaiHttp);

const BASE_URL = '/api/v1';

const { email, password } = superAdminUser;

describe('Seeding', () => {
  it('should seed categories', (done) => {
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
          .post(`${BASE_URL}/categories/seed`)
          .auth(loginRes.body.token, {
            type: 'bearer',
          })
          .send({
            //  empty
          })
          .end((__, quizRes) => {
            chai.expect(quizRes.status).to.be.equal(201);
            chai.expect(quizRes.body).to.be.a('object');
            chai.expect(quizRes.body.msg).to.be.equal('categorys successfully created');
            done();
          });
      });
  });

  // it('should seed admin users', (done) => {
  //   chai
  //     .request(app)
  //     .post(`${BASE_URL}/auth/login`)
  //     .send({
  //       email,
  //       password,
  //     })
  //     .end((_, loginRes) => {
  //       chai
  //         .request(app)
  //         .post(`${BASE_URL}/users/seed/Admin`)
  //         .auth(loginRes.body.token, {
  //           type: 'bearer',
  //         })
  //         .send({
  //           //  empty
  //         })
  //         .end((__, quizRes) => {
  //           chai.expect(quizRes.status).to.be.equal(201);
  //           chai.expect(quizRes.body).to.be.a('object');
  //           chai.expect(quizRes.body.msg).to.be.equal('Users successfully added');
  //           done();
  //         });
  //     });
  // });

  // it("should seed basic users", (done) => {
  //   chai
  //     .request(app)
  //     .post(`${BASE_URL}/auth/login`)
  //     .send({
  //       email,
  //       password,
  //     })
  //     .end((_, loginRes) => {
  //       chai
  //         .request(app)
  //         .post(`${BASE_URL}/users/seed/Basic`)
  //         .auth(loginRes.body.token, {
  //            type: "bearer",
  //           })
  //         .send({
  //           //  empty
  //         })
  //         .end((__, quizRes) => {
  //           chai.expect(quizRes.status).to.be.equal(201);
  //           chai.expect(quizRes.body).to.be.a("object");
  //           chai
  //             .expect(quizRes.body.msg)
  //             .to.be.equal("Users successfully added");
  //           done();
  //         });
  //     });
  // });
});
