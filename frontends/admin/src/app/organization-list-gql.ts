import { Injectable } from "@angular/core";
import { Query } from "apollo-angular";
import gql from "graphql-tag";
import { Organization } from "./gql-schemas/organization.gql-schema";

interface Response {
  organizationList: Organization[];
}

@Injectable({
  providedIn: "root"
})
export class OrganizationListGQL extends Query<Response> {
  document = gql`
    query OrganizationList {
      organizationList {
        _id
        name
        website
      }
    }
  `;
}
