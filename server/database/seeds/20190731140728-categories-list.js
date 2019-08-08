export default {
  up: queryInterface => queryInterface.bulkInsert(
    'Categories',
    [
      {
        name: 'Arts & Entertainment',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Industry',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Innovation & Tech',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Life',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Society',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    {}
  ),
  down: queryInterface => queryInterface.bulkDelete('Categories', null, {})
};
