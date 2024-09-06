import {
  standardHttp2ResponseGenerator,
  standardHttpResponseGenerator,
  StandardResponseGenerator,
} from '../../../src/response-generator/StandardResponseGenerator';

const funcs = [ standardHttpResponseGenerator, standardHttp2ResponseGenerator ];

describe('StandardResponseGenerator', (): any => {
  let responseGenerator: StandardResponseGenerator;

  it.each(funcs)('returns a response generator.', (func): void => {
    responseGenerator = func();
    expect(responseGenerator).toBeDefined();
  });

  it('should never create a response without a `content-length` header.', (): void => {
    // Test this for the exported functions
    for (const func of funcs) {
      responseGenerator = func();
      const response = responseGenerator.generateResponse();
      expect(response.headers).toHaveProperty('content-length');
    }

    // Test this for the class itself (empty message)
    responseGenerator = new StandardResponseGenerator('');
    const response = responseGenerator.generateResponse();
    expect(response.headers).toHaveProperty('content-length');
  });
});
