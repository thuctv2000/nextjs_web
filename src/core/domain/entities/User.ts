/**
 * Domain Entity - User
 * Represents the core User entity in the domain layer
 */
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserEntity implements User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(props: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): UserEntity {
    return new UserEntity(
      crypto.randomUUID(),
      props.email,
      props.name,
      new Date(),
      new Date()
    );
  }

  updateName(name: string): UserEntity {
    return new UserEntity(
      this.id,
      this.email,
      name,
      this.createdAt,
      new Date()
    );
  }
}
