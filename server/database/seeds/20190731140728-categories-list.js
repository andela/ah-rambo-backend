export default {
  up: queryInterface => queryInterface.bulkInsert(
    'Categories',
    [
      {
        name: 'other',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'arts & entertainment',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'industry',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'innovation & tech',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'life',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'society',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    {}
  ),
  down: queryInterface => queryInterface.bulkDelete('Categories', null, {})
};
