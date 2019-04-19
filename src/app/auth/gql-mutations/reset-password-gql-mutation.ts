import { Injectable } from "@angular/core";
import { Mutation } from "apollo-angular";
import { User } from "src/app/users/user.gql-schema";
import gql from "graphql-tag";

interface Response {
  user: User;
}

@Injectable({
  providedIn: "root"
})
export class ResetPasswordGqlMutation extends Mutation<Response> {
  document = gql`
    mutation ResetPassword($password: String!) {
      resetPassword(password: $password) {
        _id
        name
        email
        requirePasswordReset
        token
      }
    }
  `;
}
