import faker from 'faker';

/**
 * @name getNewUser
 * @returns {Object} details of a user to be signed up
 */
const getNewUser = () => {
  const newUser = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userName: faker.random.alphaNumeric(10),
    email: faker.internet.email(),
    password: faker.internet.password()
  };
  return newUser;
};

/**
 * @name getNewUserWithProfile
 * @returns {Object} details of a new user with full profile
 */
const getNewUserWithProfile = () => {
  const newUserWithProfile = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userName: faker.random.alphaNumeric(10),
    email: faker.internet.email(),
    password: faker.internet.password(),
    avatarUrl: faker.internet.avatar(),
    bio: faker.lorem.sentence(),
    followingsCount: faker.random.number(),
    followersCount: faker.random.number(),
    identifiedBy: 'fullname',
    location: faker.address.city(),
    occupation: faker.name.jobTitle()
  };
  return newUserWithProfile;
};

/**
 * @name getUserThatEditsProfile
 * @returns {Object} details of a user that wants to edit profile
 */
const getUserThatEditsProfile = () => {
  const userThatEditsProfile = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userName: faker.random.alphaNumeric(10),
    email: faker.internet.email(),
    avatarUrl: faker.internet.avatar(),
    bio: faker.lorem.sentence(),
    identifiedBy: 'fullname',
    location: faker.address.city(),
    occupation: faker.name.jobTitle()
  };
  return userThatEditsProfile;
};

/**
 * @name getComment
 * @returns {Object} comment characters
 */
const getComment = () => {
  const comment = {
    valid: faker.lorem.paragraphs(5)
  };
  return comment.valid;
};

export {
  getNewUser,
  getNewUserWithProfile,
  getUserThatEditsProfile,
  getComment
};
