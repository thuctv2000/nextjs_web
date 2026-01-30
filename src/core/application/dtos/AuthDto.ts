/**
 * Data Transfer Objects - Auth
 */
export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface RegisterResponseDto {
  id: string;
  email: string;
}
