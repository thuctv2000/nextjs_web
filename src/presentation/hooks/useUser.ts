'use client';

import { useCallback } from 'react';
import { useUserStore } from '../stores/useUserStore';
import { GetUserUseCase, CreateUserUseCase } from '@/core/application/use-cases';
import { CreateUserDto } from '@/core/application/dtos';
import { userRepository } from '@/infrastructure/repositories';

const getUserUseCase = new GetUserUseCase(userRepository);
const createUserUseCase = new CreateUserUseCase(userRepository);

export function useUser() {
  const { user, users, isLoading, error, setUser, setUsers, setLoading, setError } =
    useUserStore();

  const fetchUser = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getUserUseCase.execute(id);
      setUser(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setUser]);

  const createUser = useCallback(async (data: CreateUserDto) => {
    setLoading(true);
    setError(null);

    try {
      const result = await createUserUseCase.execute(data);
      setUser(result);
      setUsers([...users, result]);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [users, setLoading, setError, setUser, setUsers]);

  return {
    user,
    users,
    isLoading,
    error,
    fetchUser,
    createUser,
  };
}
