export default {
  up: queryInterface => queryInterface.bulkInsert(
    'Tags',
    [
      {
        name: 'foot-ball',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'fut-ball',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    {}
  ),

  down: queryInterface => queryInterface.bulkDelete('Tags', null, {})
};
