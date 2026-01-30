'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../stores/useAuthStore';
import { LoginUseCase, RegisterUseCase } from '@/core/application/use-cases';
import { LoginRequestDto, RegisterRequestDto } from '@/core/application/dtos';
import { authRepository } from '@/infrastructure/repositories';

const loginUseCase = new LoginUseCase(authRepository);
const registerUseCase = new RegisterUseCase(authRepository);

export function useAuth() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, error, setAuth, setLoading, setError, logout } =
    useAuthStore();

  const login = useCallback(
    async (data: LoginRequestDto) => {
      setLoading(true);
      setError(null);

      try {
        const result = await loginUseCase.execute(data);
        setAuth(result.user, result.token);
        router.push('/');
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router, setAuth, setLoading, setError]
  );

  const register = useCallback(
    async (data: RegisterRequestDto) => {
      setLoading(true);
      setError(null);

      try {
        const result = await registerUseCase.execute(data);
        router.push('/login');
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Registration failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router, setLoading, setError]
  );

  const handleLogout = useCallback(() => {
    logout();
    router.push('/login');
  }, [logout, router]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout: handleLogout,
  };
}
