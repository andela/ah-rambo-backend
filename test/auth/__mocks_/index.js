const request = {
  route: {
    path: '/facebook/callback'
  },
  user: {
    name: {
      givenName: 'Raambo',
      familyName: 'RamboG'
    },
    _json: {
      email: 'Rambodev@gmail.com'
    }
  },
  headers: {
    'user-agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2)
     AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36`
  },
  ip: '168.212.226.204'
};

const request2 = {
  route: {
    path: '/google/callback'
  },
  user: {
    name: {
      givenName: 'Team',
      familyName: 'RamboG'
    },
    _json: {
      email: 'dev@gmail.com'
    }
  },
  headers: {
    'user-agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2)
     AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36`
  },
  ip: '168.212.226.204'
};
const users = [
  {
    dataValues: { id: 3 }
  }
];
const mockrequest = {
  route: {
    path: ''
  }
};
const profile = {
  error: 'Auth failed'
};

export {
  request, request2, users, mockrequest, profile
};
