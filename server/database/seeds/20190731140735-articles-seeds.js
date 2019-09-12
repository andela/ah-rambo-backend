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
      },
      {
        slug: 'how-to-train-your-drag-6',
        title: 'How to train your dragon 6',
        description: 'So toothless',
        articleBody: 'It is a dragon',
        authorId: 1,
        likesCount: 0,
        dislikesCount: 0,
        publishedAt: null,
        isArchived: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        slug: 'thrhhr',
        title: ' is simply dummy text of the printing and typesetting ',
        description: null,
        authorId: 1,
        image:
            'http://res.cloudinary.com/teamrambo50/image/upload/v1565884519/fazaithupzfod35wxwys.png',
        articleBody:
            'dxrcftyugvihbjlnk;;;;;;;;;;jbihuvgycfvgubionpbivugcyftxdfcgvuhiboj',
        likesCount: 0,
        views: 36,
        categoryId: 5,
        isArchived: true,
        dislikesCount: 0,
        publishedAt: '2019-09-10T14:22:04.482Z',
        createdAt: '2019-09-10T14:22:04.486Z',
        updatedAt: '2019-09-10T14:55:06.895Z'
      }
    ],
    {}
  ),
  down: queryInterface => queryInterface.bulkDelete('Articles', null, {})
};
