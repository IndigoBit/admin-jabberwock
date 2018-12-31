import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { OrganizationListGQL } from "../organization-list-gql";
import { map } from "rxjs/operators";
import { Organization } from "../gql-schemas/organization.gql-schema";

@Component({
  selector: "app-organization-list",
  templateUrl: "./organization-list.component.html",
  styleUrls: ["./organization-list.component.scss"]
})
export class OrganizationListComponent implements OnInit {
  protected organizationList$: Observable<Organization[]>;

  constructor(private organizationListGQL: OrganizationListGQL) {}

  ngOnInit() {
    this.organizationList$ = this.organizationListGQL
      .watch()
      .valueChanges.pipe(map(res => res.data.organizationList));
  }
}
