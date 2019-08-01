/* eslint-disable max-len */
module.exports = {
  up: queryInterface => queryInterface.bulkInsert(
    'Sessions',
    [
      {
        userId: 1,
        active: true,
        devicePlatform: 'browser',
        expiresAt: new Date('2020-10-10'),
        ipAddress: '121.234.188.49',
        token:
            'eyJhbGciOiJIUzI1NiIsInR5pXVCJ9.SflKxwRJSMeKKF2QhgdhdhdhdhdT4fwpMeJf36POk6yJV_adQssw5c',
        userAgent:
            'Mozilla/5.0 (Linux; Android 7.0; SM-G892A Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/60.0.3112.107 Mobile Safari/537.36',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        active: true,
        devicePlatform: 'browser',
        expiresAt: new Date('2020-10-10'),
        ipAddress: '121.234.200.49',
        token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        userAgent:
            'Mozilla/5.0 (Linux; Android 7.0; SM-G892A Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/60.0.3112.107 Mobile Safari/537.36',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    {}
  ),
  down: queryInterface => queryInterface.bulkDelete('Sessions', null, {})
};
