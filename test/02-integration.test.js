import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';

const BASE_URL =
  'https://gist.githubusercontent.com/gpseal/8b0d738441d197623aa4ed1dab7027ef/raw/7f4aa9ee74e16ba0f0777f2cc23ab95818be51bb';

chai.use(chaiHttp); // Provides an interface for integration testing

describe('integration - GitHub Gist', () => {
  it('should get basic-users', (done) => {
    chai
      .request(BASE_URL)
      .get('/basic-users.json')
      .end((_, res) => {
        chai.expect(res.status).to.be.equal(200);
        done();
      });
  });
});

describe('integration - GitHub Gist', () => {
  it('should get admin-users', (done) => {
    chai
      .request(BASE_URL)
      .get('/admin-users.json')
      .end((_, res) => {
        chai.expect(res.status).to.be.equal(200);
        done();
      });
  });
});

describe('integration - open Trivia API', () => {
  it('should get categories', (done) => {
    chai
      .request('https://opentdb.com')
      .get('/api_category.php')
      .end((_, res) => {
        chai.expect(res.status).to.be.equal(200);
        done();
      });
  });
});
