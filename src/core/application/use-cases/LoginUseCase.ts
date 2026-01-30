import { AuthRepository } from '@/core/domain/repositories';
import { LoginRequestDto, LoginResponseDto } from '../dtos/AuthDto';

/**
 * Use Case - Login
 */
export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const result = await this.authRepository.login(dto.email, dto.password);

    return {
      token: result.token,
      user: {
        id: result.user.id,
        email: result.user.email,
      },
    };
  }
}
