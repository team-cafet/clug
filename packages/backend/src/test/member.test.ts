import { TestFactory } from './utils/setup';

const API_ENDPOINT = '/api/members';

describe('Functionnal Member endpoint testing', () => {
  const factory: TestFactory = new TestFactory();

  beforeAll(async () => {
    await factory.init();
  }, 30000);

  afterAll(async () => {
    await factory.close();
  });

  it('get all should return 200', (done) => {
    factory.app
      .get(API_ENDPOINT)
      .send()
      .auth(factory.staffToken, { type: 'bearer' })
      .set('Accept', 'application/json')
      .expect(200, done);
  });
});
