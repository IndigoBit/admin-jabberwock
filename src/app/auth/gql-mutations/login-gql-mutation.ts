import { Injectable } from "@angular/core";
import { Mutation } from "apollo-angular";
import { User } from "src/app/users/user.gql-schema";
import gql from "graphql-tag";

interface Response {
  login: User;
}

@Injectable({
  providedIn: "root"
})
export class LoginGqlMutation extends Mutation<Response> {
  document = gql`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        _id
        name
        email
        requirePasswordReset
        token
      }
    }
  `;
}
