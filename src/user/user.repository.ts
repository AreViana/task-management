import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "src/auth/dto/auth-credentials.dto";
import { ConflictException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async signUp(authDto: AuthCredentialsDto): Promise<void> {
    const username = authDto.username;
    let password = authDto.password;
    password = await this.bcryptPassword(password);

    const user: User = this.create({
      username,
      password,
    });

    try {
      await user.save();
    } catch (error) {
      throw new ConflictException(error.detail)
    }

  }

  private async bcryptPassword(password: string): Promise<string> {
    const salt: string = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

}