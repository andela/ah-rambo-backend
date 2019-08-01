import faker from 'faker';

/**
 * @name getNewUser
 * @returns {Object} details of a user to be signed up
 */
const getNewUser = () => {
  const newUser = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userName: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  };
  return newUser;
};

export default getNewUser;
