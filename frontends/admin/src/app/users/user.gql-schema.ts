export interface User {
  _id: string;
  name: string;
  email: string;
  active: boolean;
  requirePasswordReset: boolean;
  lastLogin: Date;
  roles: string[];

  // not from gql response, this is the token for the current logged in user
  token: string;
}
