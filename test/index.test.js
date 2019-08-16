import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import './auth';
import './helpers';
import './middlewares';
import './models';
import './users';
import './followers';
import './profiles';
import './articles';
import './tags';
import './comments';
import './categories';

const { expect } = chai;
chai.use(chaiHttp);
describe('SERVER TEST', () => {
  it('its expected to return a string on default url path', async () => {
    const response = await chai.request(server).get('/');
    expect(response).to.have.status(200);
  });

  it('its expected to return 404 on not found request', async () => {
    const response = await chai.request(server).get('/unknown');
    expect(response).to.have.status(404);
  });
});
