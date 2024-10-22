import { JwtStrategy } from '../../src/auth/jwt/jwt.strategy';

describe('JwtStrategy', () => {
  it('should be defined', () => {
    expect(new JwtStrategy()).toBeDefined();
  });
});
