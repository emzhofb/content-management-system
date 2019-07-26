const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Users', () => {
  it('Should be logged in and got the token', () => {
    chai
      .request(app)
      .post('/api/users/register')
      .send({ email: 'ikhdamuhammad@gmail.com', password: '1234', retypepassword: '1234' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property('data');
        expect(res.body.data.email).to.be.a('string');
        expect(res.body).to.have.property('token');
        expect(res.body.token).to.be.a('string');
      });
  });
});

describe('Users', () => {
  it('Shouldn\'t logged in and got the token', () => {
    chai
      .request(app)
      .post('/api/users/register')
      .send({ email: 'ikhdamuhammad@gmail.com', password: '1234', retypepassword: '12345' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.a('string');
      });
  });
});
