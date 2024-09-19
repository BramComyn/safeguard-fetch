import {
  standardHttp2ResponseGenerator,
  standardHttpResponseGenerator,
  StandardResponseGenerator,
} from '../../../src/response-generator/StandardResponseGenerator';

describe('StandardResponseGenerator', (): any => {
  let responseGenerator: StandardResponseGenerator;
  let funcs: (() => StandardResponseGenerator)[];

  beforeEach((): void => {
    funcs = [ standardHttpResponseGenerator, standardHttp2ResponseGenerator ];
  });

  it('returns a response generator.', (): void => {
    for (const func of funcs) {
      responseGenerator = func();
      expect(responseGenerator).toBeInstanceOf(StandardResponseGenerator);
    }
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
