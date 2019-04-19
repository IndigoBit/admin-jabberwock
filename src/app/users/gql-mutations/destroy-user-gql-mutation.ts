import { Injectable } from "@angular/core";
import { Mutation } from "apollo-angular";
import gql from "graphql-tag";
import { User } from "../user.gql-schema";

export interface Response {
  user: User;
}

@Injectable({
  providedIn: "root"
})
export class DestroyUserGqlMutation extends Mutation<Response> {
  document = gql`
    mutation DestroyUser($userId: ID!) {
      destroyUser(_id: $userId) {
        _id
      }
    }
  `;
}
