const chai = require('chai');
const chaiHttp = require('chai-http');

const Data = require('../models/data');
const app = require('../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Datas', () => {
  // first, we need to drop data collection
  Data.collection.drop();

  // before we test, we need to drop data collection
  beforeEach(done => {
    const data = new Data({
      letter: 'A',
      frequency: 1.1
    });

    data
      .save()
      .then(() => done())
      .catch(err => console.log(err));
  });

  // after we test, we will drop data collection again
  afterEach(done => {
    Data.collection.drop();
    done();
  });

  it('Should added data to mongodb', done => {
    chai
      .request(app)
      .post('/api/data')
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
