import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';

import app from '../app.js';

chai.use(chaiHttp);

const BASE_URL = '/api/v1/auth';

const adminUser = {
  first_name: 'Craig',
  last_name: 'Simpson',
  email: 'simmos@email.com',
  username: 'simmos',
  password: 'pas@1sword6',
  confirmPassword: 'pas@1sword6',
  role: 'ADMIN_USER',
};

console.log('adminUser', adminUser);

describe('auth', () => {
  it('should reject registration due to length of first name', (done) => {
    adminUser.first_name = 'c';
    console.log('adminUser inside', adminUser);
    chai
      .request(app)
      .post(`${BASE_URL}/register`)
      .send(adminUser)
      .end((_, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai
          .expect(res.body.msg)
          .to.be.equal('first name length must be more than 2 and less than 50 characters,');
        done();
      });
  });

  it('should reject registration due to invalid characters in first name', (done) => {
    adminUser.first_name = 'Cr@ig';
    console.log('adminUser inside', adminUser);
    chai
      .request(app)
      .post(`${BASE_URL}/register`)
      .send(adminUser)
      .end((_, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body.msg).to.be.equal('first name must contain alpha characters only');
        done();
      });
  });

  //   console.log(adminUser);
  // await resetUser(adminUser, adminUserOrigin);
  // adminUser.first_name = "craig";
  console.log('adminUser after', adminUser);

  //   it("should register admin user with valid input", (done) => {
  //     chai
  //       .request(app)
  //       .post(`${BASE_URL}/register`)
  //       .send(adminUser)
  //       .end((_, res) => {
  //         chai.expect(res.status).to.be.equal(201);
  //         chai.expect(res.body).to.be.a("object");
  //         chai.expect(res.body.msg).to.be.equal("User successfully registered");
  //         done();
  //       });
  //   });

  //   it("should login admin user with valid input", (done) => {
  //     const { email, password } = adminUser;
  //     chai
  //       .request(app)
  //       .post(`${BASE_URL}/login`)
  //       .send({
  //         email,
  //         password,
  //       })
  //       .end((_, res) => {
  //         chai.expect(res.status).to.be.equal(200);
  //         chai.expect(res.body).to.be.a("object");
  //         chai.expect(res.body.msg).to.be.equal("User successfully logged in");
  //         done();
  //       });
  //   });
});

export default adminUser;
