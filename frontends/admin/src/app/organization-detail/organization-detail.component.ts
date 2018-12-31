import { Component, OnInit } from "@angular/core";
import { OrganizationGQL } from "../organization-gql";
import { map, switchMap } from "rxjs/operators";
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { Organization } from "../gql-schemas/organization.gql-schema";

@Component({
  selector: "app-organization-detail",
  templateUrl: "./organization-detail.component.html",
  styleUrls: ["./organization-detail.component.scss"]
})
export class OrganizationDetailComponent implements OnInit {
  protected organization$: Observable<Organization>;
  protected inEditMode: Boolean;

  constructor(
    private organizationGQL: OrganizationGQL,
    private route: ActivatedRoute
  ) {
    this.inEditMode = false;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get(`id`);

    this.organization$ = this.organizationGQL
      .watch({ organizationId: id })
      .valueChanges.pipe(map(res => res.data.organization));
  }

  protected toggleEditMode(): void {
    this.inEditMode = !this.inEditMode;
  }

  protected editCard(): void {
    this.inEditMode = true;
  }

  protected deleteCard(): void {
    //todo, prompt, on confirm delete
    console.log(`todo`);
  }

  protected updatedCard(): void {
    this.inEditMode = false;
  }
}
