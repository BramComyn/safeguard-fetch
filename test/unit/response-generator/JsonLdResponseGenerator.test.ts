import { JsonLdResponseGenerator } from '../../../src/response-generator/JsonLdResponseGenerator';

describe('JsonLdResponseGenerator', (): void => {
  let generator: JsonLdResponseGenerator;

  it('returns a response generator.', (): void => {
    generator = new JsonLdResponseGenerator();
    expect(generator).toBeDefined();
  });

  it('should generate a response with content type `application/ld+json`.', (): void => {
    const response = generator.generateResponse();

    expect(response).toHaveProperty('headers');
    expect(response.headers).toHaveProperty('content-type', 'application/ld+json');

    expect(response).toHaveProperty('body');
    expect(response.body).toBeDefined();
    expect(response.body.read().toString()).toBeDefined();
  });
});
