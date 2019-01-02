import { Injectable } from "@angular/core";
import { Mutation } from "apollo-angular";
import gql from "graphql-tag";
import { User } from "./user.gql-schema";

interface Response {
  user: User;
}

@Injectable({
  providedIn: "root"
})
export class UpdateUserGqlMutation extends Mutation<Response> {
  document = gql`
    mutation UpdateUser(
      $userId: ID!
      $name: String
      $username: String
      $email: String
    ) {
      updateUser(
        _id: $userId
        name: $name
        username: $username
        email: $email
      ) {
        _id
        name
        username
        email
      }
    }
  `;
}
