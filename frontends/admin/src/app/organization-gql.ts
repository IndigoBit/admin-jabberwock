import { Injectable } from "@angular/core";
import { Query } from "apollo-angular";
import gql from "graphql-tag";
import { Organization } from "./gql-schemas/organization.gql-schema";

interface Response {
  organization: Organization;
}

@Injectable({
  providedIn: "root"
})
export class OrganizationGQL extends Query<Response> {
  document = gql`
    query Organization($organizationId: ID!) {
      organization(_id: $organizationId) {
        _id
        name
        website
        contact {
          name
          phone
          email
          address
        }
        users {
          _id
          name
          active
        }
      }
    }
  `;
}
