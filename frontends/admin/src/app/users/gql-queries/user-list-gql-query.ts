import { Injectable } from "@angular/core";
import { Query } from "apollo-angular";
import gql from "graphql-tag";
import { User } from "../user.gql-schema";

interface Response {
  userList: User[];
}

@Injectable({
  providedIn: "root"
})
export class UserListGqlQuery extends Query<Response> {
  document = gql`
    query UserList {
      userList {
        _id
        name
        email
        active
      }
    }
  `;
}
