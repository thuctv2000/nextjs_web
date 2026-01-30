import { AuthUser, AuthToken } from '../entities/Auth';

/**
 * Domain Repository Interface - AuthRepository
 * Defines the contract for authentication operations
 */
export interface AuthRepository {
  login(email: string, password: string): Promise<AuthToken>;
  register(email: string, password: string): Promise<AuthUser>;
}
