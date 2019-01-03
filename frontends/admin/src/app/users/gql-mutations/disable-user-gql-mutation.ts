import { Injectable } from "@angular/core";
import { Mutation } from "apollo-angular";
import gql from "graphql-tag";
import { User } from '../user.gql-schema';

export interface Response {
  user: User;
}

@Injectable({
  providedIn: "root"
})
export class DisableUserGqlMutation extends Mutation<Response> {
  document = gql`
    mutation DisableUser($userId: ID!) {
      disableUser(_id: $userId) {
        _id
        active
      }
    }
  `;
}
