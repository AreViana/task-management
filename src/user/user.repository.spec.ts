import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';

const mockCredentialsDto = { username: 'Arely', password: 'AAaa1234' };
describe('UserRepository', () => {
  let userRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository
      ],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('signUp', () => {
    let save;
    let  user;

    beforeEach(() => {
      user = new User;
      user.save = jest.fn();
      save = jest.fn();
      userRepository.create = jest.fn().mockResolvedValue({ save });
    });

    it('successfully sign up', async () => {
      save.mockResolvedValue(true); //ARREGLAR ESTE TEST
      user.save.mockResolvedValue(true);
      const result = userRepository.signUp(mockCredentialsDto);
      expect(result).resolves.toHaveBeenCalled();
    });

    it('throw a conflic exception as username already exists', () => {
      save.mockRejectedValue({ code: '23505' });
      expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('validatePassword', () => {
    let user;

    beforeEach(() => {
      userRepository.findOne = jest.fn();
      user = new User();
      user.username = 'TestUser';
      user.checkPassword = jest.fn();
    });

    it('returns the username as validation is successful', async () => {
      userRepository.findOne.mockResolvedValue(user);
      user.checkPassword.mockResolvedValue(true);

      const result = await userRepository.validatePassword(mockCredentialsDto);
      expect(result).toEqual('TestUser');
    });

    it('returns null when user cannot be found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      const result = await userRepository.validatePassword(mockCredentialsDto);
      expect(user.checkPassword).not.toHaveBeenCalled();
      expect(result).toBeNull();

    });

    it('returns null as password is invalid', async () => {
      userRepository.findOne.mockResolvedValue(user);
      user.checkPassword.mockResolvedValue(false);
      const result = await userRepository.validatePassword(mockCredentialsDto);
      expect(user.checkPassword).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('bcryptPassword', () => {
    it('calls bcrypt.hash to generate a hash', async () => {
      bcrypt.genSalt = jest.fn().mockResolvedValue('MySalt')
      bcrypt.hash = jest.fn().mockResolvedValue('TestHash');
      expect(bcrypt.genSalt).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();

      const password = mockCredentialsDto.password;
      const result = await userRepository.bcryptPassword(password);
      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 'MySalt');
      expect(result).toEqual('TestHash');
    });
  });
});