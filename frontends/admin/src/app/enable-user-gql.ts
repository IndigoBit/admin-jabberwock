import { Injectable } from "@angular/core";
import { Mutation } from "apollo-angular";
import gql from "graphql-tag";
import { User } from "./gql-schemas/user.gql-schema";

export interface Response {
  enableUser: User;
}

@Injectable({
  providedIn: "root"
})
export class EnableUserGQL extends Mutation<Response> {
  document = gql`
    mutation EnableUser($userId: ID!) {
      enableUser(_id: $userId) {
        _id
        active
      }
    }
  `;
}
