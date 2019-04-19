import { User } from '../users/user.gql-schema';

export interface Article {
  _id: string;
  name: string;
  description: string;
  tags: string[];
  content: string;
  creator: User;
}
