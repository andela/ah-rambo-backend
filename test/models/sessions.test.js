import { expect } from 'chai';
import models from '../../server/database/models';
import generateSessionData from './__mocks__';

const { Session } = models;

describe('Session Model Test', () => {
  context('when userId is invalid', () => {
    it('returns an error', async () => {
      try {
        const sessionData = generateSessionData(1);
        await Session.create({
          ...sessionData,
          userId: 'fndhbkjfbkejdsbnkfjbnkjd'
        });
      } catch (error) {
        expect(error.errors[0].message).to.equal('userId must be an integer');
      }
    });
  });

  context("when user with userId doesn't exist", () => {
    it('returns an error', async () => {
      const id = 78437973927983;
      try {
        const sessionData = generateSessionData(id);
        await Session.create(sessionData);
      } catch (error) {
        expect(error.message).to.be.a('string');
      }
    });
  });

  context('when userId is missing', () => {
    it('returns an error', async () => {
      try {
        const sessionData = generateSessionData(1);
        delete sessionData.userId;
        await Session.create(sessionData);
      } catch (error) {
        expect(error.message).to.equal(
          'notNull Violation: Session.userId cannot be null'
        );
      }
    });
  });

  context('when active field is invalid', () => {
    it('returns an error', async () => {
      const active = 'dfjhghijhsgkubsuyfdb';
      try {
        const sessionData = generateSessionData(1);
        await Session.create({
          ...sessionData,
          active
        });
      } catch (error) {
        expect(error.message).to.equal(
          `invalid input syntax for type boolean: "${active}"`
        );
      }
    });
  });

  context('when active field is missing', () => {
    it('will use its default value', async () => {
      const sessionData = generateSessionData(1);
      delete sessionData.active;
      const session = await Session.create(sessionData);
      expect(session.active).to.equal(true);
    });
  });

  context('when devicePlatform is invalid', () => {
    it('returns an error', async () => {
      try {
        const sessionData = generateSessionData(1);
        await Session.create({
          ...sessionData,
          devicePlatform: 'ketnkjrnkjbnrjhbejb'
        });
      } catch (error) {
        expect(error.errors[0].message).to.equal(
          'devicePlatform must be either browser or mobile'
        );
      }
    });
  });

  context('when devicePlatform is missing', () => {
    it('will use its default value', async () => {
      const sessionData = generateSessionData(1);
      delete sessionData.devicePlatform;
      const session = await Session.create(sessionData);

      expect(session.devicePlatform).to.equal('browser');
    });
  });

  context('when expiresAt field is invalid', () => {
    it('returns an error', async () => {
      try {
        const sessionData = generateSessionData(1);
        await Session.create({
          ...sessionData,
          expiresAt: 'fdjhbjdhbhjbd'
        });
      } catch (error) {
        expect(error.errors[0].message).to.equal(
          'expiresAt must be a date string'
        );
      }
    });
  });

  context('when expiresAt field is missing', () => {
    it('returns an error', async () => {
      try {
        const sessionData = generateSessionData(1);
        delete sessionData.expiresAt;
        await Session.create(sessionData);
      } catch (error) {
        expect(error.errors[0].message).to.equal(
          'Session.expiresAt cannot be null'
        );
      }
    });
  });

  context('when ipAddress is invalid', () => {
    it('returns an error', async () => {
      try {
        const sessionData = generateSessionData(1);
        await Session.create({
          ...sessionData,
          ipAddress: new Error()
        });
      } catch (error) {
        expect(error.message).to.equal(
          'string violation: ipAddress cannot be an array or an object'
        );
      }
    });
  });

  context('when ipAddress is missing', () => {
    it('returns an error', async () => {
      try {
        const sessionData = generateSessionData(1);
        await Session.create(sessionData);
        delete sessionData.ipAddress;
      } catch (error) {
        expect(error.message).to.equal('Session.ipAddress cannot be null');
      }
    });
  });

  context('when token is invalid', () => {
    it('returns an error', async () => {
      try {
        const sessionData = generateSessionData(1);
        await Session.create({
          ...sessionData,
          token: new Error()
        });
      } catch (error) {
        expect(error.message).to.equal(
          'string violation: token cannot be an array or an object'
        );
      }
    });
  });

  context('when token is missing', () => {
    it('returns an error', async () => {
      try {
        const sessionData = generateSessionData(1);
        await Session.create(sessionData);
        delete sessionData.token;
      } catch (error) {
        expect(error.message).to.equal('Session.token cannot be null');
      }
    });
  });

  context('when userAgent is invalid', () => {
    it('returns an error', async () => {
      try {
        const sessionData = generateSessionData(1);
        await Session.create({
          ...sessionData,
          userAgent: new Error()
        });
      } catch (error) {
        expect(error.message).to.equal(
          'string violation: userAgent cannot be an array or an object'
        );
      }
    });
  });

  context('when userAgent is missing', () => {
    it('returns an error', async () => {
      try {
        const sessionData = generateSessionData(1);
        await Session.create(sessionData);
        delete sessionData.userAgent;
      } catch (error) {
        expect(error.message).to.equal('Session.userAgent cannot be null');
      }
    });
  });

  context('when all fields are missing', () => {
    it('returns an error', async () => {
      try {
        await Session.create({});
      } catch (error) {
        const allFieldsThrowError = [
          'userId',
          'expiresAt',
          'ipAddress',
          'token',
          'userAgent'
        ].every(field => error.message.includes(`Session.${field} cannot be null`));
        expect(error.errors.length).to.equal(5);
        expect(allFieldsThrowError).to.equal(true);
      }
    });
  });
});
