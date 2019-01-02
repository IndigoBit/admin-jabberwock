export interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
  active: boolean;
  requirePasswordReset: boolean;
}
