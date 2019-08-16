import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import middlewares from '../../server/middlewares';

const { authorizeUser } = middlewares;

chai.use(sinonChai);

describe('authorizeUser middleware', () => {
  context(
    'when an unauthorized user makes tries to access a protected route',
    () => {
      it('returns an unauthorized error', async () => {
        const request = { user: { level: 2 } };
        const response = { status() {}, json() {} };
        const next = sinon.spy();
        const status = sinon.stub(response, 'status').returnsThis();
        sinon.stub(response, 'json').returns({});
        const authMiddleware = authorizeUser(5);
        await authMiddleware(request, response, next);
        expect(status).to.calledWith(403);
        response.json.restore();
      });
    }
  );

  context(
    'when an authorized user makes tries to access a protected route',
    () => {
      it('goes to the next middleware', async () => {
        const request = { user: { level: 9 } };
        const response = { status() {}, json() {} };
        const next = sinon.spy();
        sinon.stub(response, 'json').returns({});
        const authMiddleware = authorizeUser(5);
        await authMiddleware(request, response, next);
        expect(next).to.calledOnce;
        response.json.restore();
      });
    }
  );
});
