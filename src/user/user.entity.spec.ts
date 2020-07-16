import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';

describe('User entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User;
    user.password = 'testPassword';
    bcrypt.compare = jest.fn();
  });

  describe('checkPassword', () => {
    it('returns true with a valid password', async () => {
      bcrypt.compare.mockReturnValue(true);
      expect(bcrypt.compare).not.toHaveBeenCalled();

      const result = await user.checkPassword('testPassword');
      expect(bcrypt.compare).toHaveBeenCalledWith('testPassword', user.password);
      expect(result).toBe(true);
    });

    it('returns false with a invalid password', async () => {
      bcrypt.compare.mockReturnValue(false);
      expect(bcrypt.compare).not.toHaveBeenCalled();

      const result = await user.checkPassword('wrongTestPassword');
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongTestPassword', user.password);
      expect(result).toBe(false);
    });
  });
});