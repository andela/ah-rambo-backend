import { expect } from 'chai';
import sinon from 'sinon';
import validatePagination from '../../server/middlewares/paginationValidation';

describe('Test Pagination Validation', () => {
  context('when the pagination function is passed invalid queries', () => {
    it('returns validation errors', () => {
      const req = { query: { page: 'show', pageItems: 0 } };
      const res = { status() {}, json() {} };
      const next = sinon.spy();
      const status = sinon.stub(res, 'status').returnsThis();
      validatePagination(req, res, next);
      expect(status).to.calledWith(422);
    });
  });
});
