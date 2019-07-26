const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');
const expect = chai.expect;

chai.use(chaiHttp);

let token;

describe('Register', () => {
  it('Should be logged in and got the token', () => {
    chai
      .request(app)
      .post('/api/users/register')
      .send({
        email: 'ikhdamuhammad@gmail.com',
        password: '1234',
        retypepassword: '1234'
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property('data');
        expect(res.body.data.email).to.be.a('string');
        expect(res.body).to.have.property('token');
        expect(res.body.token).to.be.a('string');
        token = res.body.token;
      });
  });

  it("Shouldn't logged in and token is null", () => {
    chai
      .request(app)
      .post('/api/users/register')
      .send({
        email: 'ikhdamuhammad@gmail.com',
        password: '1234',
        retypepassword: '12345'
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('Invalid register.');
      });
  });
});

describe('Check', () => {
  it('Should accepted the token', () => {
    chai
      .request(app)
      .post('/api/users/check')
      .send({ token: token })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property('valid');
        expect(res.body.valid).to.be.a('string');
        expect(res.body.valid).to.equal('true');
      });
  });

  it('Should declined the token', () => {
    chai
      .request(app)
      .post('/api/users/check')
      .send({ token: null })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res).to.be.json;
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('Invalid token.');
      });
  });
});

describe('Destroy', () => {
  it('Should delete the token', () => {
    chai
      .request(app)
      .get('/api/users/destroy')
      .set('token', null)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property('logout');
        expect(res.body.logout).to.be.a('boolean');
        expect(res.body.logout).to.equal(true);
      });
  });
});
