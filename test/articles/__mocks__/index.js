import faker from 'faker';

const ArticleData = {
  title: ' is simply dummy text of the printing and typesetting ',
  description: 'ext ever since the 1500s, when an unknown printer',
  image: faker.internet.avatar(),
  articleBody: 'ext ever since the 1500s, when an unknown printer took a ga',
  status: 'publish',
  authorId: 1,
  categoryId: 1,
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
  tags: 'tech,business',
  category: 'other'
};

const ArticleData5 = {
  title: ' is simply dummy text of the printing and typesetting ',
  description: 'ext ever since the 1500s, when an unknown printer',
  articleBody: 'ext ever since the 1500s, when an unknown printer took a ga',
  status: 'draft',
  tags: 'tech,business',
  category: 'Lifestyle'
};

const ArticleData2 = {
  title: ' is simply dummy text of the printing and typesetting ',
  description: 'ext ever since the 1500s, when an unknown printer',
  articleBody: 'ext ever since the 1500s, when an unknown printer took a ga',
  status: 'publish',
  tags: 'tech,business',
  category: 'sport'
};

const ArticleData3 = {
  title: ' is simply dummy text of the printing and typesetting ',
  description: 'ext ever since the 1500s, when an unknown printer',
  articleBody: 'ext ever since the 1500s, when an unknown printer took a ga',
  status: 'publish',
  tags: ' technnnnn , businesssss  ',
  category: 'sport'
};

const surplusTagArticleData = {
  title: ' is simply dummy text of the printing and typesetting ',
  description: 'ext ever since the 1500s, when an unknown printer',
  articleBody: 'ext ever since the 1500s, when an unknown printer took a ga',
  status: 'publish',
  tags: Array(17)
    .fill('-')
    .map(item => faker.commerce.department())
    .join(),
  category: 'sport'
};

const ArticleData20 = {
  title: ' is simply dummy text of the printing and typesetting ',
  description: 'ext ever since the 1500s, when an unknown printer',
  articleBody: 'ext ever since the 1500s, when an unknown printer took a ga',
  status: 'publish',
  tags: 'tech,business',
  category: 'life'
};

const noTagArticleData = {
  title: ' is simply dummy text of the printing and typesetting ',
  description: 'ext ever since the 1500s, when an unknown printer',
  articleBody: 'ext ever since the 1500s, when an unknown printer took a ga',
  status: 'publish',
  category: 'sport'
};

const newArticleData = {
  title: ' is simply dummy text of the printing and typesetting ',
  description: 'ext ever since the 1500s, when an unknown printer',
  articleBody: 'ext ever since the 1500s, when an unknown printer took a ga',
  status: 'publish',
  tags: 'technology',
  category: 'Life'
};
const ArticleData10 = {
  title: ' is simply dummy text of the printing and typesetting ',
  description: 'ext ever since the 1500s, when an unknown printer',
  articleBody: 'ext ever since the 1500s, when an unknown printer took a ga',
  status: 'publish',
  category: 'Life'
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
    tags: 'tech, business',
    category: 'sport'
  },
  user: { id: 1 },
  params: {
    slug: 'unkown'
  }
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
  slug: 'title',
  isArchived: false
};

const badImage = {
  title: ' is simply dummy text of the printing and typesetting ',
  description: 'ext ever since the 1500s, when an unknown printer',
  articleBody: 'ext ever since the 1500s, when an unknown printer took a ga',
  image: 'this is TIA',
  tags: 'tech,business',
  category: 'business'
};

const categoryDetails = {
  name: '',
  id: 1
};

const authenticatedUser = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  userName: 'ahRambo50',
  email: 'authors.haven@haven.com',
  password: 'authors.haven@haven.com',
  confirmPassword: 'authors.haven@haven.com'
};

const checkmateArticleData = {
  title: ' checkmate ',
  description: 'ext ever since the 1500s, when an unknown printer',
  articleBody: 'ext ever since the 1500s, when an unknown printer took a ga',
  status: 'publish',
  category: 'sport'
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
  ArticleData5,
  ArticleData10,
  ArticleData20,
  authenticatedUser,
  categoryDetails,
  ArticleData3,
  surplusTagArticleData,
  checkmateArticleData
};
