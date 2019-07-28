const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../app');
const expect = chai.expect;

chai.use(chaiHttp);

let token;

describe('Register', () => {
  it('Should be registered and got the token', (done) => {
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
        done();
      });
  });

  it("Shouldn't registered and token is null", (done) => {
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
        done();
      });
  });
});

// describe('Login', () => {
//   it('Should be logged in and got the token', (done) => {
//     chai
//       .request(app)
//       .post('api/users/login')
//       .send({
//         email: 'ikhdamuhammad@gmail.com',
//         password: '1234'
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res).to.be.json;
//         expect(res.body).to.have.property('data');
//         expect(res.body.data.email).to.be.a('string');
//         expect(res.body).to.have.property('token');
//         expect(res.body.token).to.be.a('string');
//         token = res.body.token;
//         done();
//       });
//   });

//   it("Shouldn't be logged in and token is null", (done) => {
//     chai
//       .request(app)
//       .post('api/users/login')
//       .send({
//         email: undefined,
//         password: undefined
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(403);
//         expect(res).to.be.json;
//         expect(res.body).to.have.property('message');
//         expect(res.body.message).to.be.a('string');
//         expect(res.body.message).to.equal('Invalid login.');
//         done();
//       });
//   });
// });

describe('Check', () => {
  it('Should accepted the token', (done) => {
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
        done();
      });
  });

  it('Should declined the token', (done) => {
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
        done();
      });
  });
});

// describe('Destroy', () => {
//   it('Should delete the token', (done) => {
//     chai
//       .request(app)
//       .get('/api/users/destroy')
//       .set('token', null)
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res).to.be.json;
//         expect(res.body).to.have.property('logout');
//         expect(res.body.logout).to.be.a('boolean');
//         expect(res.body.logout).to.equal(true);
//         done();
//       });
//   });
// });
