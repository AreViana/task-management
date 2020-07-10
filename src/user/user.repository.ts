import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "src/auth/dto/auth-credentials.dto";
import { ConflictException } from "@nestjs/common";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async signUp(authDto: AuthCredentialsDto): Promise<void> {
    const user: User = this.create(authDto);
    
    try {
      await user.save();
    } catch (error) {
      throw new ConflictException(error.detail)
    }

  }
}