import { TestFactory } from './utils/setup';

const API_ENDPOINT = '/api/clubs';

describe('Functionnal Club endpoint testing', () => {
  const factory: TestFactory = new TestFactory();

  beforeAll(async () => {
    await factory.init();
  }, 30000);

  afterAll(async () => {
    await factory.close();
  });

  it('get all should return 200', async (done) => {
    factory.app
      .get(API_ENDPOINT)
      .send()
      .auth(factory.staffToken, {type: 'bearer'})
      .set('Accept', 'application/json')
      .expect(200, done);
  });

  //   describe('Basic Testing with admin', () => {

  //     it('GET ALL', async (done) => {
  //       expect(true);
  //       // request(app)
  //       //   .get(API_ENDPOINT)
  //       //   .auth(adminUser.token, { type: 'bearer' })
  //       //   .expect(200, done);
  //     });

  //     // it('POST', async (done) => {
  //     //   request(app)
  //     //     .post(API_ENDPOINT)
  //     //     .auth(adminUser.token, { type: 'bearer' })
  //     //     .send({
  //     //       organisation: { id: 1 },
  //     //       user: { email: 'test@test.ch', password: '1234' }
  //     //     })
  //     //     .expect(200, done);
  //     // });

  //     // it('GET ONE', async (done) => {
  //     //   request(app)
  //     //     .get(`${API_ENDPOINT}/1`)
  //     //     .auth(adminUser.token, { type: 'bearer' })
  //     //     .expect(200, done);
  //     // });

  //     // it('PUT', async (done) => {
  //     //   request(app)
  //     //     .put(`${API_ENDPOINT}/1`)
  //     //     .auth(adminUser.token, { type: 'bearer' })
  //     //     .send({
  //     //       user: { email: 'test-updated@test.ch', password: '12346' }
  //     //     })
  //     //     .expect(200, done);
  //     // });

  //   });
});
