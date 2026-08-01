import { PublicUser } from './interfaces/public-user';

export class User {
  constructor(
    private readonly _id: string,
    private _name: string,
    private _email: string,
    private _password: string,
    private _role: string,
    private _active: boolean,
  ) {}

  static create(id: string, name: string, email: string, password: string, role: string): User {
    if (!name || name.trim() === '' || name.length < 3) {
      throw new Error('Nombre de usuario inválido');
    }
    if (!email || email.trim() === '' || !email.includes('@')) {
      throw new Error('Email inválido');
    }
    if (!password || password.trim() === '' || password.length < 8) {
      throw new Error('Contraseña inválida');
    }
    if (!role || role.trim() === '' || role !== 'admin' && role !== 'user') {
      throw new Error('Rol inválido');
    }
    return new User(id, name, email, password, role, true);
  }

  static fromPersistence(props: {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    active: boolean;
  }): User {
    return new User(props.id, props.name, props.email, props.password, props.role, props.active);
  }


  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get active(): boolean {
    return this._active;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get role(): string {
    return this._role;
  }

  deactivate(): void {
    this._active = false;
  }

  toPublic(): PublicUser {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      active: this.active,
    };
  }
}