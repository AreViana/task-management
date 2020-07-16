import { Test, TestingModule } from "@nestjs/testing";
import { JwtStrategy } from "./jwt.strategy";
import { UserRepository } from '../../user/user.repository';
import { User } from "../../user/user.entity";
import { UnauthorizedException } from "@nestjs/common";

const mockUserRepository = () => ({
  findOne: jest.fn()
});

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UserRepository, useFactory: mockUserRepository }
      ],
    }).compile();

    jwtStrategy = await module.get<JwtStrategy>(JwtStrategy);
    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('validate', () => {
    it('validates and returns the user in jwt payload', async () => {
      const user = new User;
      user.username = 'TestUser'
      userRepository.findOne.mockResolvedValue(user);

      const result = await jwtStrategy.validate({ username: 'TestUser' });
      expect(userRepository.findOne).toHaveBeenCalledWith({ username: 'TestUser' });
      expect(result).toEqual(user);

    });

    it('throw unauthorize exception', async () => {
      userRepository.findOne.mockResolvedValue(false);
      expect(jwtStrategy.validate({ username: 'WrongtUser' })).rejects.toThrow(UnauthorizedException);
    });
  })
});