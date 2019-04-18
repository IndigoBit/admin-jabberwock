import { Injectable } from "@angular/core";
import { Query } from "apollo-angular";
import gql from "graphql-tag";
import { User } from "src/app/users/user.gql-schema";

interface Response {
  currentUser: User;
}

@Injectable({
  providedIn: "root"
})
export class CurrentUserGqlQuery extends Query<Response> {
  document = gql`
    query CurrentUser {
      currentUser {
        _id
        name
        email
        requirePasswordReset
        token
      }
    }
  `;
}
