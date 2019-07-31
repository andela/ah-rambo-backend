export default {
  up: queryInterface => queryInterface.bulkInsert(
    'Users',
    [
      {
        firstName: 'Abiola',
        lastName: 'JayZ',
        userName: 'JhayX',
        email: 'abiola.jz@andela.com',
        password: 'incorrect',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    {}
  ),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
