import { TestFactory } from './utils/setup';

describe('Functionnal App testing', () => {
  const factory: TestFactory = new TestFactory();

  beforeAll(async () => {
    await factory.init();
  }, 30000);

  afterAll(async () => {
    await factory.close();
  });

  it('should return 404', (done) => {
    factory.app.post('/givemea404').expect(404, done);
  });
});
