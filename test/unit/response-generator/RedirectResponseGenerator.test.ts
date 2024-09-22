import { RedirectResponseGenerator } from '../../../src/response-generator/RedirectResponseGenerator';

describe('RedirectResponseGenerator', (): void => {
  let responseGenerator: RedirectResponseGenerator;

  beforeEach((): void => {
    responseGenerator = new RedirectResponseGenerator(301, 'https://example.com');
  });

  it('returns a response generator.', (): void => {
    expect(responseGenerator).toBeDefined();
  });

  it('should generate a response with a redirect status code.', (): void => {
    const response = responseGenerator.generateResponse();
    expect(response.headers[':status']).toBe('301');
  });

  it('should generate a response with a `location` header.', (): void => {
    const response = responseGenerator.generateResponse();
    expect(response.headers.location).toBe('https://example.com');
  });

  it('should generate a response without a body.', (): void => {
    const response = responseGenerator.generateResponse();
    expect(response.body).toBeUndefined();
  });
});
