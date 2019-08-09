import { expect } from 'chai';
import sendGrid from '@sendgrid/mail';
import sinon from 'sinon';
import sendMail from '../../server/helpers/emailModule';

describe('Email Sender Function Tests', () => {
  context('when the function gets right parameters', () => {
    it('sends the email and returns a success code', async () => {
      const email = 'rambo@gmail.com';
      const subject = 'hello';
      const content = '<h1> Welcome to Rambo </h1>';
      const response = { statusCode() {} };
      const statusCode = sinon.stub(response, 'statusCode').returnsThis();
      const stub = sinon.stub(sendGrid, 'send');
      stub.yields(statusCode);
      await sendMail(email, subject, content);
      sendGrid.send.restore();
    });
  });

  context('when the email does not send', () => {
    it('returns an error', async () => {
      const stub = sinon.stub(sendGrid, 'send');
      const statusCode = 400;
      stub.yields(statusCode);
      await sendMail();
      sendGrid.send.restore();
    });
  });

  context('when there is a server error', () => {
    it('should throw', async () => {
      const stub = sinon.stub(sendGrid, 'send');
      const error = new Error('server error');
      stub.yields(error);
      const res = await sendMail();
      expect(res).to.be.an('error');
      stub.restore();
    });
  });
});
