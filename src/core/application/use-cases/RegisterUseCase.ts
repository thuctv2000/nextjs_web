import { AuthRepository } from '@/core/domain/repositories';
import { RegisterRequestDto, RegisterResponseDto } from '../dtos/AuthDto';

/**
 * Use Case - Register
 */
export class RegisterUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(dto: RegisterRequestDto): Promise<RegisterResponseDto> {
    const result = await this.authRepository.register(dto.email, dto.password);

    return {
      id: result.id,
      email: result.email,
    };
  }
}
