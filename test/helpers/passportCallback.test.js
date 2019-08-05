import { expect } from 'chai';
import passportCallback from '../../server/middlewares/passportCallback';

const profile = {
  name: 'Rambo'
};
/**
 * @name done
 * @param {Object} err express request object
 * @param {function} next express response object
 * @returns {JSON} JSON object with details of new user
 */
const done = (err, next) => next;
it('test passport Callback', () => {
  const result = passportCallback(null, null, profile, done);
  expect(result).to.be.instanceOf(Object);
  expect(result.name).to.be.equal(profile.name);
});
