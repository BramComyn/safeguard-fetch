import { TurtleResponseGenerator } from '../../../src/response-generator/TurtleResponseGenerator';

describe('TurtleResponseGenerator', (): void => {
  let generator: TurtleResponseGenerator;

  it('returns a response generator.', (): void => {
    generator = new TurtleResponseGenerator();
    expect(generator).toBeDefined();
  });

  it('should generate a response with content type `text/turtle`.', (): void => {
    const response = generator.generateResponse();

    expect(response).toHaveProperty('headers');
    expect(response.headers).toHaveProperty('content-type', 'text/turtle');

    expect(response).toHaveProperty('body');
    expect(response.body).toBeDefined();
    expect(response.body.read().toString()).toBeDefined();
  });
});
