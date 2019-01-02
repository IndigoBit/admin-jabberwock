import { Injectable } from "@angular/core";
import { Mutation } from "apollo-angular";
import gql from "graphql-tag";
import { User } from "./user.gql-schema";

export interface Response {
  user: User;
}

@Injectable({
  providedIn: "root"
})
export class ResetUserPasswordGqlMutation extends Mutation<Response> {
  document = gql`
    mutation ResetUserPassword($userId: ID!) {
      resetUserPassword(_id: $userId) {
        _id
        requirePasswordReset
      }
    }
  `;
}
