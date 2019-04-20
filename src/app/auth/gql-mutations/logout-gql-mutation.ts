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
export class LogoutGqlMutation extends Mutation<Response> {
  document = gql`
    mutation Logout {
      logout
    }
  `;
}
