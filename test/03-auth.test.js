import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import prisma from '../utils/prisma.js';
import app from '../app.js';
import { adminUser, adminUserOriginal } from './users.js';

chai.use(chaiHttp);

const BASE_URL = '/api/v1/auth';

// resets user values at the beginning of each test
const resetUser = (user, orignalUser) => {
  Object.keys(user).forEach((key) => {
    user[key] = orignalUser[key];
  });
};

// const adminUserOriginal = {
//     first_name: 'Craig',
//     last_name: 'Simpson',
//     email: 'simmos@email.com',
//     username: 'simmos',
//     password: 'pas@1sword6',
//     confirmPassword: 'pas@1sword6',
//     role: 'ADMIN_USER',
//   };

// const adminUser = {
//   first_name: 'Craig',
//   last_name: 'Simpson',
//   email: 'simmos@email.com',
//   username: 'simmos',
//   password: 'pas@1sword6',
//   confirmPassword: 'pas@1sword6',
//   role: 'ADMIN_USER',
// };

describe('auth', () => {
  it('should reject registration due to length of first name', (done) => {
    adminUser.first_name = 'c';
    chai
      .request(app)
      .post(`${BASE_URL}/register`)
      .send(adminUser)
      .end((_, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai
          .expect(res.body.msg)
          .to.be.equal('first name must have a min length of 2, and max length of 50 characters');
        done();
      });
  });

  it('should reject registration due to invalid characters in first name', (done) => {
    adminUser.first_name = 'Cr@ig';
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

  it('should reject registration due to length of last name', (done) => {
    resetUser(adminUser, adminUserOriginal);
    adminUser.last_name = 'S';
    chai
      .request(app)
      .post(`${BASE_URL}/register`)
      .send(adminUser)
      .end((_, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai
          .expect(res.body.msg)
          .to.be.equal('last name must have a min length of 2, and max length of 50 characters');
        done();
      });
  });

  it('should reject registration due to invalid characters in last name', (done) => {
    adminUser.last_name = 'S@mpson';
    chai
      .request(app)
      .post(`${BASE_URL}/register`)
      .send(adminUser)
      .end((_, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body.msg).to.be.equal('last name must contain alpha characters only');
        done();
      });
  });

  it('should reject registration due to invalid email format', (done) => {
    resetUser(adminUser, adminUserOriginal);
    adminUser.email = 'simmos@email';
    chai
      .request(app)
      .post(`${BASE_URL}/register`)
      .send(adminUser)
      .end((_, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai
          .expect(res.body.msg)
          .to.be.equal('email must contain an @ special character & a second-level domain');
        done();
      });
  });

  it('should reject registration due to invalid email format', (done) => {
    adminUser.email = 'simmosATemail.com';
    chai
      .request(app)
      .post(`${BASE_URL}/register`)
      .send(adminUser)
      .end((_, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai
          .expect(res.body.msg)
          .to.be.equal('email must contain an @ special character & a second-level domain');
        done();
      });
  });

  it('should reject registration due to username not matching email', (done) => {
    resetUser(adminUser, adminUserOriginal);
    adminUser.username = 'simmosa';
    chai
      .request(app)
      .post(`${BASE_URL}/register`)
      .send(adminUser)
      .end((_, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body.msg).to.be.equal('email prefix must match username');
        done();
      });
  });

  it('should reject registration due to incorrect username length', (done) => {
    adminUser.username = 'simm';
    chai
      .request(app)
      .post(`${BASE_URL}/register`)
      .send(adminUser)
      .end((_, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai
          .expect(res.body.msg)
          .to.be.equal('username must have a min length of 5, and max length of 10 characters');
        done();
      });
  });

  it('should reject registration due to username containing incorrect characters', (done) => {
    adminUser.username = 'simmos@';
    chai
      .request(app)
      .post(`${BASE_URL}/register`)
      .send(adminUser)
      .end((_, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body.msg).to.be.equal('username must contain alphanumeric characters only');
        done();
      });
  });

  it('should reject registration due to incorrect password length', (done) => {
    resetUser(adminUser, adminUserOriginal);
    adminUser.confirmPassword = 'p@sw0rd';
    adminUser.password = 'p@sw0rd';
    chai
      .request(app)
      .post(`${BASE_URL}/register`)
      .send(adminUser)
      .end((_, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai
          .expect(res.body.msg)
          .to.be.equal('password must have a min length of 8, and max length of 16 characters');
        done();
      });
  });

  it('should reject registration due to incorrect password format', (done) => {
    adminUser.confirmPassword = 'p@ssword';
    adminUser.password = 'p@ssword';
    chai
      .request(app)
      .post(`${BASE_URL}/register`)
      .send(adminUser)
      .end((_, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai
          .expect(res.body.msg)
          .to.be.equal('password must contain 1 numeric character & 1 special character');
        done();
      });
  });

  it('should reject registration due to passwords not matching', (done) => {
    resetUser(adminUser, adminUserOriginal);
    adminUser.confirmPassword = 'p@1sword7';
    chai
      .request(app)
      .post(`${BASE_URL}/register`)
      .send(adminUser)
      .end((_, res) => {
        chai.expect(res.status).to.be.equal(400);
        chai.expect(res.body.msg).to.be.equal('passwords do not match');
        done();
      });
  });

  it('should register admin user with valid input', (done) => {
    resetUser(adminUser, adminUserOriginal);
    chai
      .request(app)
      .post(`${BASE_URL}/register`)
      .send(adminUser)
      .end((_, res) => {
        chai.expect(res.status).to.be.equal(201);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal('User successfully registered');
        done();
      });
  });

  it('should login admin user with valid input', (done) => {
    const { email, password } = adminUser;
    chai
      .request(app)
      .post(`${BASE_URL}/login`)
      .send({
        email,
        password,
      })
      .end((_, res) => {
        chai.expect(res.status).to.be.equal(200);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.msg).to.be.equal(`${adminUser.username} successfully logged in`);
        done();
      });
  });
});
