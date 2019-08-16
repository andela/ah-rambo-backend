import faker from 'faker';

const ArticleData = {
  title: ' is simply dummy text of the printing and typesetting ',
  description: 'ext ever since the 1500s, when an unknown printer',
  image: faker.internet.avatar(),
  articleBody: 'ext ever since the 1500s, when an unknown printer took a ga',
  status: 'publish',
  tags: ['tech', 'business']
};

const invalidArticleData = {
  title: ' is simply dummy text of the printing and typesetting ',
  description: 'ext ever since the 1500s, when an unknown printer',
  articleBody: 'ext ever since the 1500s, when an unknown printer took a ga',
  status: 'invalid',
  tags: 'tech,business'
};

const ArticleData4 = {
  title: ' is simply dummy text of the printing and typesetting ',
  description: 'ext ever since the 1500s, when an unknown printer',
  articleBody: 'ext ever since the 1500s, when an unknown printer took a ga',
  status: 'draft',
  tags: 'tech,business'
};

const ArticleData2 = {
  title: ' is simply dummy text of the printing and typesetting ',
  description: 'ext ever since the 1500s, when an unknown printer',
  articleBody: 'ext ever since the 1500s, when an unknown printer took a ga',
  status: 'publish',
  tags: 'tech,business'
};

const noTagArticleData = {
  title: ' is simply dummy text of the printing and typesetting ',
  description: 'ext ever since the 1500s, when an unknown printer',
  articleBody: 'ext ever since the 1500s, when an unknown printer took a ga',
  status: 'publish'
};

const newArticleData = {
  title: ' is simply dummy text of the printing and typesetting ',
  description: 'ext ever since the 1500s, when an unknown printer',
  articleBody: 'ext ever since the 1500s, when an unknown printer took a ga',
  status: 'publish',
  tags: 'technology'
};
const ArticleData10 = {
  title: ' is simply dummy text of the printing and typesetting ',
  description: 'ext ever since the 1500s, when an unknown printer',
  articleBody: 'ext ever since the 1500s, when an unknown printer took a ga',
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
    articleBody: 'ext ever since the 1500s, when an unknown printer took a ga',
    tags: 'tech, business'
  },
  user: { id: 1 }
};
const fakeoutput = {
  likesCount: 0,
  dislikesCount: 0,
  id: 3,
  articleBody: 'lorem hipsom',
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
  articleBody: 'ext ever since the 1500s, when an unknown printer took a ga',
  image: 'this is TIA',
  tags: 'tech,business'
};

const authenticatedUser = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  userName: 'ahRambo50',
  email: 'authors.haven@haven.com',
  password: 'authors.haven@haven.com',
  confirmPassword: 'authors.haven@haven.com'
};

export {
  ArticleData,
  ArticleData2,
  noTagArticleData,
  newArticleData,
  myfile,
  request,
  fakeoutput,
  invalidArticleData,
  ArticleData4,
  badImage,
  ArticleData10,
  authenticatedUser
};
