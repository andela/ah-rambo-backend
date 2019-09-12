import { expect } from 'chai';
import { articleResponse } from '../../server/helpers';

const article = {
  dataValues: {
    id: 4,
    slug: 'thrhhr',
    title: 'thrhhr',
    description: null,
    image:
      'http://res.cloudinary.com/teamrambo50/image/upload/v1565884519/fazaithupzfod35wxwys.png',
    articleBody:
      'dxrcftyugvihbjlnk;;;;;;;;;;jbihuvgycfvgubionpbivugcyftxdfcgvuhiboj',
    likesCount: 0,
    views: 36,
    authorId: 1,
    categoryId: 3,
    isArchived: true,
    dislikesCount: 0,
    publishedAt: '2019-09-10T14:22:04.482Z',
    createdAt: '2019-09-10T14:22:04.486Z',
    updatedAt: '2019-09-10T14:55:06.895Z',
    Author: {
      firstName: 'demo',
      lastName: 'User',
      userName: 'demoUser'
    },
    comments: [],
    Category: { name: 'other' },
    tags: [{ name: 'justice' }, { name: 'justina' }]
  }
};

const res = {
  body: null,
  statusCode: null,
  send(data1) {
    this.body = data1;
    return data1;
  },
  json(data1) {
    this.body = data1;
    return data1;
  },
  status(responseStatus) {
    this.statusCode = responseStatus;
    return this;
  }
};

describe('articleResponse Test', () => {
  it('modifies the article response from the database', async () => {
    const test = await articleResponse(res, 200, article);
    expect(test.article.Category).to.equal(undefined);
    expect(test.article.category).to.equal(article.dataValues.Category.name);
  });
});
