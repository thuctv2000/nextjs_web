import { UserRepository } from '@/core/domain/repositories';
import { UserEntity } from '@/core/domain/entities';
import { CreateUserDto, UserResponseDto } from '../dtos/UserDto';

/**
 * Use Case - Create User
 * Application layer use case for creating a new user
 */
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const user = UserEntity.create({
      email: dto.email,
      name: dto.name,
    });

    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id,
      email: savedUser.email,
      name: savedUser.name,
      createdAt: savedUser.createdAt.toISOString(),
      updatedAt: savedUser.updatedAt.toISOString(),
    };
  }
}
