import { AuthUser, AuthToken } from '@/core/domain/entities';
import { AuthRepository } from '@/core/domain/repositories';
import { httpClient } from '../api/httpClient';

/**
 * Infrastructure - Auth Repository Implementation
 * Connects to Go backend on Render
 */
export class AuthRepositoryImpl implements AuthRepository {
  async login(email: string, password: string): Promise<AuthToken> {
    const response = await httpClient.post<AuthToken>('/login', {
      email,
      password,
    });

    if (response.status !== 200) {
      throw new Error('Login failed');
    }

    return response.data;
  }

  async register(email: string, password: string): Promise<AuthUser> {
    const response = await httpClient.post<AuthUser>('/register', {
      email,
      password,
    });

    if (response.status !== 201 && response.status !== 200) {
      throw new Error('Registration failed');
    }

    return response.data;
  }
}

export const authRepository = new AuthRepositoryImpl();
