
import request from 'supertest';
import app from '../server';


let server;
let http;
beforeAll((done) => {
  server = app.listen(4000, (err) => {
    if (err) return done(err);
    http = request.agent(server);

    done();
  });
});

afterAll(done => server && server.close(done));

describe('Test post the root path', () => {
  test('It should response the GET method', async () => {
    const response = await http.get('/');
    expect(response.statusCode).toBe(200);
  });
});

describe('Test User the root path', () => {
  test('It should  response the GET method with 404', async () => {
    const response = await http.get('/unknown');
    expect(response.statusCode).toBe(404);
  });
});
