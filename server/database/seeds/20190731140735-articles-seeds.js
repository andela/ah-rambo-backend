export default {
  up: queryInterface => queryInterface.bulkInsert(
    'Articles',
    [
      {
        slug: 'how-to-train-your-dragon',
        title: 'How to train your dragon',
        description: 'Ever wonder how?',
        articleBody: 'It takes a Jacobian',
        authorId: 1,
        likesCount: 0,
        dislikesCount: 0,
        publishedAt: new Date(),
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'how-to-train-your-dragon-2',
        title: 'How to train your dragon 2',
        description: 'So toothless',
        articleBody: 'It is a dragon',
        authorId: 1,
        likesCount: 0,
        dislikesCount: 0,
        publishedAt: new Date(),
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    {}
  ),
  down: queryInterface => queryInterface.bulkDelete('Articles', null, {})
};
