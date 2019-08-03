const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Data = require('../models/data');
const app = require('../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Datas', () => {
  // first, we need to drop data collection
  Data.collection.drop();
  User.collection.drop();

  // before we test, we need to drop data collection
  beforeEach(done => {
    bcrypt.hash('1234', 10).then(password => {
      const user = new User({
        email: 'ikhdamuhammad@gmail.com',
        password: password
      });

      user
        .save()
        .then(() => {
          const data = new Data({
            letter: 'A',
            frequency: 1.1
          });

          data.save().then(() => done());
        })
        .catch(err => console.log(err));
    });
  });

  // after we test, we will drop data collection again
  afterEach(done => {
    Data.collection.drop();
    User.collection.drop();
    done();
  });

  it('Should filtering data', done => {
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
          .post('/api/data/search')
          .set('token', r.body.token)
          .send(
            { letter: 'A', frequency: 1.1 } || { letter: 'A' } || {
                frequency: 1.1
              }
          )
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body[0]).to.have.property('letter');
            expect(res.body[0].letter).to.be.a('string');
            expect(res.body[0].letter).to.equal('A');
            done();
          });
      });
  });

  it("Shouldn't filtering data", done => {
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
          .post('/api/data/search')
          .set('token', r.body.token)
          .send(
            { letter: 'B', frequency: 1.2 } || { letter: 'B' } || {
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

  it('Should read all data', done => {
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
          .get('/api/data')
          .set('token', r.body.token)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body[0]).to.have.property('letter');
            expect(res.body[0].letter).to.be.a('string');
            expect(res.body[0].letter).to.equal('A');
            done();
          });
      });
  });

  it('Should update data from mongodb', done => {
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
          .get('/api/data')
          .set('token', r.body.token)
          .end((err, res) => {
            chai
              .request(app)
              .put(`/api/data/${res.body[0]._id}`)
              .set('token', r.body.token)
              .send({
                letter: 'C',
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

  it("Shouldn't update data from mongodb", done => {
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
          .get('/api/data')
          .set('token', r.body.token)
          .end((err, res) => {
            chai
              .request(app)
              .put(`/api/data/5d4112f9f10dea13b5dd5d0e`)
              .set('token', r.body.token)
              .send({
                letter: 'C',
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

  it('Should added data to mongodb', done => {
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
          .post('/api/data')
          .set('token', r.body.token)
          .send({
            letter: 'B',
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

  it('Should deleted data from mongodb', done => {
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
          .get('/api/data')
          .set('token', r.body.token)
          .end((err, res) => {
            chai
              .request(app)
              .delete(`/api/data/${res.body[0]._id}`)
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

  it("Shouldn't delete data from mongodb", done => {
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
          .get('/api/data')
          .set('token', r.body.token)
          .end((err, res) => {
            chai
              .request(app)
              .delete(`/api/data/5d4112f9f10dea13b5dd5d0e`)
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

  it('Should find data from mongodb', done => {
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
          .get('/api/data')
          .set('token', r.body.token)
          .end((err, res) => {
            chai
              .request(app)
              .get(`/api/data/${res.body[0]._id}`)
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

  it("Shouldn't find data from mongodb", done => {
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
          .get('/api/data')
          .set('token', r.body.token)
          .end((err, res) => {
            chai
              .request(app)
              .get(`/api/data/5d4112f9f10dea13b5dd5d0e`)
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
