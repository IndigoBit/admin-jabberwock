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
    mutation ResetPassword($_id: ID!) {
      resetUserPassword(_id: $_id) {
        _id
        name
        email
        requirePasswordReset
        token
      }
    }
  `;
}
