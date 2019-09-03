const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const DataDate = require('../models/datadate');
const app = require('../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Datadates', () => {
  // first, we need to drop datadate collection
  DataDate.collection.drop();
  User.collection.drop();

  // before we test, we need to drop datadate collection
  beforeEach(done => {
    bcrypt.hash('1234', 10).then(password => {
      const user = new User({
        local: {
          email: 'ikhdamuhammad@gmail.com',
          password: password
        }
      });

      user
        .save()
        .then(() => {
          const dataDate = new DataDate({
            letter: '1999-05-23',
            frequency: 1.1
          });

          dataDate.save().then(() => done());
        })
        .catch(err => console.log(err));
    });
  });

  // after we test, we will drop datadate collection again
  afterEach(done => {
    DataDate.collection.drop();
    User.collection.drop();
    done();
  });

  it('Should filtering datadate', done => {
    chai
      .request(app)
      .post('/api/users/login')
      .send({
        email: 'ikhdamuhammad@gmail.com',
        password: '1234'
      })
      .end((e, r) => {
        chai
          .request(app)
          .post('/api/datadate/search')
          .set('token', r.body.token)
          .send(
            { letter: '1999-05-23', frequency: 1.1 } || { letter: '1999-05-23' } || {
                frequency: 1.1
              }
          )
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body[0]).to.have.property('letter');
            expect(res.body[0].letter).to.be.a('string');
            expect(res.body[0].letter).to.equal('1999-05-23');
            done();
          });
      });
  });

  it("Shouldn't filtering datadate", done => {
    chai
      .request(app)
      .post('/api/users/login')
      .send({
        email: 'ikhdamuhammad@gmail.com',
        password: '1234'
      })
      .end((e, r) => {
        chai
          .request(app)
          .post('/api/datadate/search')
          .set('token', r.body.token)
          .send(
            { letter: '2019-05-23', frequency: 1.2 } || { letter: '2019-05-23' } || {
                frequency: 1.2
              }
          )
          .end((err, res) => {
            expect(res).to.have.status(406);
            expect(res).to.be.json;
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal("data can't be found!");
            done();
          });
      });
  });

  it('Should read all datadate', done => {
    chai
      .request(app)
      .post('/api/users/login')
      .send({
        email: 'ikhdamuhammad@gmail.com',
        password: '1234'
      })
      .end((e, r) => {
        chai
          .request(app)
          .get('/api/datadate')
          .set('token', r.body.token)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body[0]).to.have.property('letter');
            expect(res.body[0].letter).to.be.a('string');
            expect(res.body[0].letter).to.equal('1999-05-23');
            done();
          });
      });
  });

  it('Should update datadate from mongodb', done => {
    chai
      .request(app)
      .post('/api/users/login')
      .send({
        email: 'ikhdamuhammad@gmail.com',
        password: '1234'
      })
      .end((e, r) => {
        chai
          .request(app)
          .get('/api/datadate')
          .set('token', r.body.token)
          .end((err, res) => {
            chai
              .request(app)
              .put(`/api/datadate/${res.body[0]._id}`)
              .set('token', r.body.token)
              .send({
                letter: '1999-05-23',
                frequency: 1.3
              })
              .end((error, response) => {
                expect(response).to.have.status(205);
                expect(response).to.be.json;
                expect(response.body).to.have.property('message');
                expect(response.body.message).to.be.a('string');
                expect(response.body.message).to.equal('data has been updated');
                done();
              });
          });
      });
  });

  it("Shouldn't update datadate from mongodb", done => {
    chai
      .request(app)
      .post('/api/users/login')
      .send({
        email: 'ikhdamuhammad@gmail.com',
        password: '1234'
      })
      .end((e, r) => {
        chai
          .request(app)
          .get('/api/datadate')
          .set('token', r.body.token)
          .end((err, res) => {
            chai
              .request(app)
              .put(`/api/datadate/5d4112f9f10dea13b5dd5d0e`)
              .set('token', r.body.token)
              .send({
                letter: '1999-05-23',
                frequency: 1.3
              })
              .end((error, response) => {
                expect(response).to.have.status(406);
                expect(response).to.be.json;
                expect(response.body).to.have.property('message');
                expect(response.body.message).to.be.a('string');
                expect(response.body.message).to.equal("can't update data");
                done();
              });
          });
      });
  });

  it('Should added datadate to mongodb', done => {
    chai
      .request(app)
      .post('/api/users/login')
      .send({
        email: 'ikhdamuhammad@gmail.com',
        password: '1234'
      })
      .end((e, r) => {
        chai
          .request(app)
          .post('/api/datadate')
          .set('token', r.body.token)
          .send({
            letter: '1999-05-23',
            frequency: 1.2
          })
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.equal('data has been added');
            done();
          });
      });
  });

  it('Should deleted datadate from mongodb', done => {
    chai
      .request(app)
      .post('/api/users/login')
      .send({
        email: 'ikhdamuhammad@gmail.com',
        password: '1234'
      })
      .end((e, r) => {
        chai
          .request(app)
          .get('/api/datadate')
          .set('token', r.body.token)
          .end((err, res) => {
            chai
              .request(app)
              .delete(`/api/datadate/${res.body[0]._id}`)
              .set('token', r.body.token)
              .end((error, response) => {
                expect(response).to.have.status(202);
                expect(response).to.be.json;
                expect(response.body).to.have.property('message');
                expect(response.body.message).to.be.a('string');
                expect(response.body.message).to.equal('data has been deleted');
                done();
              });
          });
      });
  });

  it("Shouldn't delete datadate from mongodb", done => {
    chai
      .request(app)
      .post('/api/users/login')
      .send({
        email: 'ikhdamuhammad@gmail.com',
        password: '1234'
      })
      .end((e, r) => {
        chai
          .request(app)
          .get('/api/datadate')
          .set('token', r.body.token)
          .end((err, res) => {
            chai
              .request(app)
              .delete(`/api/datadate/5d4112f9f10dea13b5dd5d0e`)
              .set('token', r.body.token)
              .end((error, response) => {
                expect(response).to.have.status(406);
                expect(response).to.be.json;
                expect(response.body).to.have.property('message');
                expect(response.body.message).to.be.a('string');
                expect(response.body.message).to.equal("can't delete data");
                done();
              });
          });
      });
  });

  it('Should find datadate from mongodb', done => {
    chai
      .request(app)
      .post('/api/users/login')
      .send({
        email: 'ikhdamuhammad@gmail.com',
        password: '1234'
      })
      .end((e, r) => {
        chai
          .request(app)
          .get('/api/datadate')
          .set('token', r.body.token)
          .end((err, res) => {
            chai
              .request(app)
              .get(`/api/datadate/${res.body[0]._id}`)
              .set('token', r.body.token)
              .end((error, response) => {
                expect(response).to.have.status(202);
                expect(response).to.be.json;
                expect(response.body).to.have.property('message');
                expect(response.body.message).to.be.a('string');
                expect(response.body.message).to.equal('data found');
                done();
              });
          });
      });
  });

  it("Shouldn't find datadate from mongodb", done => {
    chai
      .request(app)
      .post('/api/users/login')
      .send({
        email: 'ikhdamuhammad@gmail.com',
        password: '1234'
      })
      .end((e, r) => {
        chai
          .request(app)
          .get('/api/datadate')
          .set('token', r.body.token)
          .end((err, res) => {
            chai
              .request(app)
              .get(`/api/datadate/5d4112f9f10dea13b5dd5d0e`)
              .set('token', r.body.token)
              .end((error, response) => {
                expect(response).to.have.status(406);
                expect(response).to.be.json;
                expect(response.body).to.have.property('message');
                expect(response.body.message).to.be.a('string');
                expect(response.body.message).to.equal("can't find the data");
                done();
              });
          });
      });
  });
});
