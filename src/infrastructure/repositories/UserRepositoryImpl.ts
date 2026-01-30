import { User } from '@/core/domain/entities';
import { UserRepository } from '@/core/domain/repositories';
import { httpClient } from '../api/httpClient';

/**
 * Infrastructure - User Repository Implementation
 * Implements UserRepository interface with HTTP client
 */
export class UserRepositoryImpl implements UserRepository {
  private readonly endpoint = '/api/users';

  async findById(id: string): Promise<User | null> {
    try {
      const response = await httpClient.get<User>(`${this.endpoint}/${id}`);
      return this.mapToEntity(response.data);
    } catch {
      return null;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const response = await httpClient.get<User[]>(this.endpoint, {
        params: { email },
      });
      return response.data.length > 0 ? this.mapToEntity(response.data[0]) : null;
    } catch {
      return null;
    }
  }

  async findAll(): Promise<User[]> {
    const response = await httpClient.get<User[]>(this.endpoint);
    return response.data.map(this.mapToEntity);
  }

  async save(user: User): Promise<User> {
    const response = await httpClient.post<User>(this.endpoint, user);
    return this.mapToEntity(response.data);
  }

  async update(user: User): Promise<User> {
    const response = await httpClient.put<User>(`${this.endpoint}/${user.id}`, user);
    return this.mapToEntity(response.data);
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`${this.endpoint}/${id}`);
  }

  private mapToEntity(data: User): User {
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }
}

export const userRepository = new UserRepositoryImpl();
