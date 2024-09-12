import { AttackResponseGenerator } from '../../../src/response-generator/AttackResponseGenerator';

const actualSizesAndContentLengths = {
  0: 0,
  1: 0,
  10: 1,
  50: null,
  100: 10,
  1000: 100,
  10000: 1000,
  100000: 10000,
  1000000: 100000,
  Infinity: 1000000,
};

describe('AttackResponseGenerator', (): any => {
  let responseGenerator: AttackResponseGenerator;

  it('returns a response generator.', (): void => {
    responseGenerator = new AttackResponseGenerator(100, 100);
    expect(responseGenerator).toBeDefined();
  });

  it.each(Object.entries(actualSizesAndContentLengths))(
    'should generate a response with an actual size of %i and a content length of %i.',
    async(actualSizeString, contentLength): Promise<void> => {
      const actualSize = Number.parseInt(actualSizeString, 10);
      responseGenerator = new AttackResponseGenerator(actualSize, contentLength);

      const response = responseGenerator.generateResponse();

      expect(response).toHaveProperty('headers');
      expect(response.headers).toHaveProperty('content-type', 'text/plain');
      expect(response.headers['content-length']).toBe(contentLength ?? undefined);

      expect(response).toHaveProperty('body');
      expect(response.body).toBeDefined();

      if (Number.isFinite(actualSize)) {
        const body = response.body as any;
        const bodyString = body.read().toString();

        // eslint-disable-next-line jest/no-conditional-expect
        expect(bodyString).toHaveLength(actualSize);
      } else {
        // Quick hack, because `await once(...)`` keeps the test active indefinitely
        // eslint-disable-next-line jest/no-conditional-expect
        expect(response.body.read()).toEqual(Buffer.from('a'));
      }
    },
  );

  it('should not have a `content-length` header if the content length is null.', (): void => {
    responseGenerator = new AttackResponseGenerator(100, null);
    const response = responseGenerator.generateResponse();
    expect(response.headers).not.toHaveProperty('content-length');
  });
});
