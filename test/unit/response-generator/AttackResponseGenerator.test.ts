import { AttackResponseGenerator } from '../../../src/response-generator/AttackResponseGenerator';

jest.useFakeTimers();
jest.spyOn(globalThis, 'setInterval');

const actualSizesAndContentLengths = {
  0: 0,
  1: 0,
  10: 1,
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
    (actualSizeString, contentLength): void => {
      const actualSize = Number.parseInt(actualSizeString, 10);
      responseGenerator = new AttackResponseGenerator(actualSize, contentLength);

      const response = responseGenerator.generateResponse();

      expect(setInterval).toHaveBeenCalledTimes(actualSize === Infinity ? 1 : 0);
      expect(response).toHaveProperty('headers');

      expect(response.headers).toHaveProperty('content-type', 'text/plain');
      expect(response.headers['content-length']).toBe(contentLength);

      expect(response).toHaveProperty('body');
      expect(response.body).toBeDefined();

      if (Number.isFinite(actualSize)) {
        const body = response.body as any;
        const bodyString = body.read().toString();

        // eslint-disable-next-line jest/no-conditional-expect
        expect(bodyString).toHaveLength(actualSize);
      }
    },
  );

  it('should not have a `content-length` header if the content length is null.', (): void => {
    responseGenerator = new AttackResponseGenerator(100, null);
    const response = responseGenerator.generateResponse();
    expect(response.headers).not.toHaveProperty('content-length');
  });
});
