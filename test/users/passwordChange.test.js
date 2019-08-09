import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { config } from 'dotenv';
import app from '../../server';
import { matchPassword, conflictPassword } from './__mocks__/passwordReset';

config();

chai.use(chaiHttp);

const baseUrl = process.env.BASE_URL;
let userToken;
describe('POST User', () => {
  it('should sign up a new user', async () => {
    const response = await chai
      .request(app)
      .post(`${baseUrl}/users/create`)
      .send({
        firstName: 'firstName',
        lastName: 'lastname',
        userName: 'adeRambo',
        email: 'Rambo@gmail.com',
        password: 'conflictingNo',
        confirmPassword: 'conflictingNo'
      });
    const { token } = response.body;
    userToken = token;
    expect(response).to.have.status(201);
    expect(response.body).to.be.an('object');
  });

  context(
    `when a registered user wants to change thier 
  password with non-conflicting password`,
    () => {
      it('it reset the users password', async () => {
        const response = await chai
          .request(app)
          .patch(`${baseUrl}/users/changePassword`)
          .send({ ...matchPassword })
          .set('Authorization', userToken);
        expect(response).to.have.status(200);
      });
    }
  );

  context(
    `when a registered user wants to change thier 
  password with conflicting password`,
    () => {
      it('will not reset the users password', async () => {
        const response = await chai
          .request(app)
          .patch(`${baseUrl}/users/changePassword`)
          .send({ ...conflictPassword })
          .set('Authorization', userToken);
        expect(response).to.have.status(422);
      });
    }
  );
});
