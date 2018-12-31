import { Injectable } from "@angular/core";
import { Mutation } from "apollo-angular";
import gql from "graphql-tag";
import { Organization } from "./gql-schemas/organization.gql-schema";

interface Response {
  organization: Organization;
}

@Injectable({
  providedIn: "root"
})
export class UpdateOrganizationGQL extends Mutation<Response> {
  document = gql`
    mutation UpdateOrganization(
      $organizationId: ID!
      $name: String!
      $website: String
      $contact_name: String!
      $contact_email: String!
      $contact_phone: String!
      $contact_address: String!
    ) {
      updateOrganization(
        _id: $organizationId
        name: $name
        website: $website
        contact_name: $contact_name
        contact_email: $contact_email
        contact_phone: $contact_phone
        contact_address: $contact_address
      ) {
        _id
      }
    }
  `;
}
