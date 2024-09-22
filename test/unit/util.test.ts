import {
  getPort,
  getStatusCode,
  getStatusCodeClass,
  isRedirection,
  isSuccessful,
  sanitizeStatusCode,
} from '../../src/util';

describe('Utility functions', (): void => {
  describe('sanitizeStatusCode', (): void => {
    it('should return the status code if it is valid.', (): void => {
      for (let i = 100; i < 102; i++) {
        expect(sanitizeStatusCode(i)).toBe(i);
      }

      for (let i = 200; i < 207; i++) {
        expect(sanitizeStatusCode(i)).toBe(i);
      }

      for (let i = 300; i < 309; i++) {
        expect(sanitizeStatusCode(i)).toBe(i);
      }

      for (let i = 400; i < 427; i++) {
        expect(sanitizeStatusCode(i)).toBe(i === 418 ? 400 : i);
      }

      for (let i = 500; i < 506; i++) {
        expect(sanitizeStatusCode(i)).toBe(i);
      }
    });

    it('should throw an error if the status code is invalid.', (): void => {
      expect((): void => {
        sanitizeStatusCode(0);
      }).toThrow('Invalid HTTP status code not assignable to status code class: 0');

      expect((): void => {
        sanitizeStatusCode(1000);
      }).toThrow('Invalid HTTP status code not assignable to status code class: 1000');
    });

    it('should return the base code of the status class if the status code is valid, but unknown.', (): void => {
      for (let i = 102; i < 200; i++) {
        expect(sanitizeStatusCode(i)).toBe(100);
      }

      for (let i = 207; i < 300; i++) {
        expect(sanitizeStatusCode(i)).toBe(200);
      }

      for (let i = 309; i < 400; i++) {
        expect(sanitizeStatusCode(i)).toBe(300);
      }

      for (let i = 427; i < 500; i++) {
        expect(sanitizeStatusCode(i)).toBe(400);
      }

      for (let i = 506; i < 600; i++) {
        expect(sanitizeStatusCode(i)).toBe(500);
      }
    });
  });

  describe('getStatusCodeClass', (): void => {
    it('should return the correct status code class.', (): void => {
      for (let i = 100; i < 200; i++) {
        expect(getStatusCodeClass(i)).toBe('informational');
      }

      for (let i = 200; i < 300; i++) {
        expect(getStatusCodeClass(i)).toBe('successful');
      }

      for (let i = 300; i < 400; i++) {
        expect(getStatusCodeClass(i)).toBe('redirection');
      }

      for (let i = 400; i < 500; i++) {
        expect(getStatusCodeClass(i)).toBe('client error');
      }

      for (let i = 500; i < 600; i++) {
        expect(getStatusCodeClass(i)).toBe('server error');
      }
    });

    it('should throw an error if the status code is invalid.', (): void => {
      expect((): void => {
        getStatusCodeClass(0);
      }).toThrow('Invalid HTTP status code has no status code class: 0');

      expect((): void => {
        getStatusCodeClass(1000);
      }).toThrow('Invalid HTTP status code has no status code class: 1000');
    });
  });

  describe('getStatusCode', (): void => {
    it('should return the status code as integer from the incoming headers.', (): void => {
      expect(getStatusCode({ ':status': '200' })).toBe(200);
      expect(getStatusCode({ ':status': '404' })).toBe(404);
      expect(getStatusCode({ ':status': '500' })).toBe(500);
      expect(getStatusCode({ ':status': '301' })).toBe(301);
      expect(getStatusCode({ ':status': '100' })).toBe(100);
    });

    it('should throw an error if the status code is invalid.', (): void => {
      expect((): void => {
        getStatusCode({});
      }).toThrow('Invalid HTTP status code not assignable to status code class: 0');

      expect((): void => {
        getStatusCode({ ':status': '0' });
      }).toThrow('Invalid HTTP status code not assignable to status code class: 0');
    });
  });

  describe('isSuccessful', (): void => {
    it('should return true if the status code is successful.', (): void => {
      for (let i = 200; i < 300; i++) {
        expect(isSuccessful(i)).toBe(true);
      }
    });

    it('should return false if the status code is not successful.', (): void => {
      for (let i = 100; i < 200; i++) {
        expect(isSuccessful(i)).toBe(false);
      }

      for (let i = 300; i < 600; i++) {
        expect(isSuccessful(i)).toBe(false);
      }
    });
  });

  describe('isRedirection', (): void => {
    it('should return true if the status code is a redirection.', (): void => {
      for (let i = 300; i < 400; i++) {
        expect(isRedirection(i)).toBe(true);
      }
    });

    it('should return false if the status code is not a redirection.', (): void => {
      for (let i = 100; i < 300; i++) {
        expect(isRedirection(i)).toBe(false);
      }

      for (let i = 400; i < 600; i++) {
        expect(isRedirection(i)).toBe(false);
      }
    });
  });

  describe('getPort', (): void => {
    it('should return the correct port number.', (): void => {
      expect(getPort('AttackServerUnit')).toBe(6001);
    });
  });
});
