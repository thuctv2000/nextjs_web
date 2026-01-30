/**
 * Domain Entity - Auth User
 * Matches backend User struct
 */
export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthToken {
  token: string;
  user: AuthUser;
}
