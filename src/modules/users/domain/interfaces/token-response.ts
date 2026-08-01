import { PublicUser } from './public-user';

export interface TokenResponse {
  accessToken: string;
  user: PublicUser;
}
