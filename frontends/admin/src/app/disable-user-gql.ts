import { Injectable } from "@angular/core";
import { Mutation } from "apollo-angular";
import gql from "graphql-tag";
import { User } from "./gql-schemas/user.gql-schema";

export interface Response {
  disableUser: User;
}

@Injectable({
  providedIn: "root"
})
export class DisableUserGQL extends Mutation<Response> {
  document = gql`
    mutation DisableUser($userId: ID!) {
      disableUser(_id: $userId) {
        _id
        active
      }
    }
  `;
}
