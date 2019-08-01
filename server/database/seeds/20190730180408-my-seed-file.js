export default {
  up: queryInterface => queryInterface.bulkInsert(
    'Users',
    [
      {
        firstName: 'Abiola',
        lastName: 'JayZ',
        userName: 'JhayX',
        email: 'abiola.jz@andela.com',
        password:
            '$2y$12$3t1adkk7/grjsz2cG5hlXOTO8LwZUmGeG7zs6udoH78MeoPNmXQ.y',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    {}
  ),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
