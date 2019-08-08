export default {
  up: queryInterface => queryInterface.bulkInsert(
    'Users',
    [
      {
        firstName: 'Abiola',
        lastName: 'JayZ',
        userName: 'JhayXXX',
        email: 'abiola.jz@andela.com',
        password:
            '$2y$12$3t1adkk7/grjsz2cG5hlXOTO8LwZUmGeG7zs6udoH78MeoPNmXQ.y',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Authors',
        lastName: 'Haven',
        userName: 'authorsHaven',
        email: 'authors@haven.com',
        password:
            '$2y$12$3t1adkk7/grjsz2cG5hlXOTO8LwZUmGeG7zs6udoH78MeoPNmXQ.y',
        avatarUrl:
            'https://res.cloudinary.com/teamrambo50/image/upload/v1565160704/avatar-1577909_1280_xsoxql.png',
        bio: 'This is a simple bio of Abiola',
        followingsCount: 1,
        followersCount: 1,
        identifiedBy: 'fullname',
        location: 'Lagos, Nigeria',
        occupation: 'Software Engineer',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    {}
  ),

  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
