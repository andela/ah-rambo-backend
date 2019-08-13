import faker from 'faker';

const ArticleData = {
  title: ' is simply dummy text of the printing and typesetting ',
  description: 'ext ever since the 1500s, when an unknown printer',
  image: faker.internet.avatar(),
  body: 'ext ever since the 1500s, when an unknown printer took a ga',
  status: 'publish'
};

const invalidArticleData = {
  title: ' is simply dummy text of the printing and typesetting ',
  description: 'ext ever since the 1500s, when an unknown printer',
  body: 'ext ever since the 1500s, when an unknown printer took a ga',
  status: 'invalid'
};

const ArticleData4 = {
  title: ' is simply dummy text of the printing and typesetting ',
  description: 'ext ever since the 1500s, when an unknown printer',
  body: 'ext ever since the 1500s, when an unknown printer took a ga',
  status: 'draft'
};

const ArticleData2 = {
  title: ' is simply dummy text of the printing and typesetting ',
  description: 'ext ever since the 1500s, when an unknown printer',
  body: 'ext ever since the 1500s, when an unknown printer took a ga',
  status: 'publish'
};
const myfile = faker.image.dataUri(200, 200);
const request = {
  file: {
    fieldname: 'image',
    originalname: 'Screenshot 2019-07-10 at 3.40.27 PM.png',
    encoding: '7bit',
    mimetype: 'image/png',
    buffer: [0],
    size: 0
  },
  body: {
    title: ' is simply dummy text of the printing and typesetting ',
    description: 'ext ever since the 1500s, when an unknown printer',
    body: 'ext ever since the 1500s, when an unknown printer took a ga'
  },
  user: { id: 1 }
};
const fakeoutput = {
  likesCount: 0,
  dislikesCount: 0,
  id: 3,
  body: 'lorem hipsom',
  title: 'title',
  description: 'loremhipsomdeusematmddmdd',
  image:
    'http://res.cloudinary.com/teamrambo50/image/upload/v1565734710/k5fspd6uo4b4fw2upxlq.png',
  authorId: 17,
  slug: 'title'
};

const badImage = {
  title: ' is simply dummy text of the printing and typesetting ',
  description: 'ext ever since the 1500s, when an unknown printer',
  body: 'ext ever since the 1500s, when an unknown printer took a ga',
  image: 'this is TIA'
};

export {
  ArticleData,
  ArticleData2,
  myfile,
  request,
  fakeoutput,
  invalidArticleData,
  ArticleData4,
  badImage
};
