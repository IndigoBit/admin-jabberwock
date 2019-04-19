import { Injectable } from "@angular/core";
import { Query } from "apollo-angular";
import gql from "graphql-tag";
import { User } from "../user.gql-schema";

interface Response {
  user: User;
}

@Injectable({
  providedIn: "root"
})
export class UserGqlQuery extends Query<Response> {
  document = gql`
    query User($userId: ID!) {
      user(_id: $userId) {
        _id
        name
        email
        active
        requirePasswordReset
      }
    }
  `;
}
