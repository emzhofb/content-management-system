const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Map = require('../models/map');
const app = require('../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Maps', () => {
  // first, we need to drop map collection
  Map.collection.drop();
  User.collection.drop();

  // before we test, we need to drop map collection
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
          const map = new Map({
            title: 'Trans Studio Mall',
            lat: -6.9261257,
            lng: 107.6343728
          });

          map.save().then(() => done());
        })
        .catch(err => console.log(err));
    });
  });

  // after we test, we will drop map collection again
  afterEach(done => {
    Map.collection.drop();
    User.collection.drop();
    done();
  });

  it('Should filtering map', done => {
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
          .post('/api/maps/search')
          .set('token', r.body.token)
          .send({ title: 'Trans Studio Mall' })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body[0]).to.have.property('title');
            expect(res.body[0].title).to.be.a('string');
            expect(res.body[0].title).to.equal('Trans Studio Mall');
            done();
          });
      });
  });

  it("Shouldn't filtering map", done => {
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
          .post('/api/maps/search')
          .set('token', r.body.token)
          .send({ title: 'Tokyo' })
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

  it('Should read all map', done => {
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
          .get('/api/maps')
          .set('token', r.body.token)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body[0]).to.have.property('title');
            expect(res.body[0].title).to.be.a('string');
            expect(res.body[0].title).to.equal('Trans Studio Mall');
            done();
          });
      });
  });

  it('Should update map from mongodb', done => {
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
          .get('/api/maps')
          .set('token', r.body.token)
          .end((err, res) => {
            chai
              .request(app)
              .put(`/api/maps/${res.body[0]._id}`)
              .set('token', r.body.token)
              .send({
                title: 'Trans Studio Bandung',
                lat: -6.9261257,
                lng: 107.6343728
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

  it("Shouldn't update map from mongodb", done => {
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
          .get('/api/maps')
          .set('token', r.body.token)
          .end((err, res) => {
            chai
              .request(app)
              .put(`/api/maps/5d4112f9f10dea13b5dd5d0e`)
              .set('token', r.body.token)
              .send({
                title: 'Trans Studio Mall',
                lat: -6.9261257,
                lng: 107.6343728
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

  it('Should added map to mongodb', done => {
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
          .post('/api/maps')
          .set('token', r.body.token)
          .send({
            title: 'Cihampelas Walk',
            lat: -6.12345,
            lng: 107.54321
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

  it('Should deleted map from mongodb', done => {
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
          .get('/api/maps')
          .set('token', r.body.token)
          .end((err, res) => {
            chai
              .request(app)
              .delete(`/api/maps/${res.body[0]._id}`)
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

  it("Shouldn't delete map from mongodb", done => {
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
          .get('/api/maps')
          .set('token', r.body.token)
          .end((err, res) => {
            chai
              .request(app)
              .delete(`/api/maps/5d4112f9f10dea13b5dd5d0e`)
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

  it('Should find map from mongodb', done => {
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
          .get('/api/maps')
          .set('token', r.body.token)
          .end((err, res) => {
            chai
              .request(app)
              .get(`/api/maps/${res.body[0]._id}`)
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

  it("Shouldn't find map from mongodb", done => {
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
          .get('/api/maps')
          .set('token', r.body.token)
          .end((err, res) => {
            chai
              .request(app)
              .get(`/api/maps/5d4112f9f10dea13b5dd5d0e`)
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
