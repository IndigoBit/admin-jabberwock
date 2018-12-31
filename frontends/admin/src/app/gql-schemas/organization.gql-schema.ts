import { User } from "./user.gql-schema";
import { Contact } from "./contact.gql-schema";

export interface Organization {
  _id: string;
  name: string;
  website: string;
  contact: Contact;
  users: User[];
}
