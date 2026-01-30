import { UserRepository } from '@/core/domain/repositories';
import { UserResponseDto } from '../dtos/UserDto';

/**
 * Use Case - Get User
 * Application layer use case for retrieving a user
 */
export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
