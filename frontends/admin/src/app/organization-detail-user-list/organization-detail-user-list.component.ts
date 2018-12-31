import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { MatPaginator, MatSort } from "@angular/material";
import { OrganizationDetailUserListDataSource } from "./organization-detail-user-list-datasource";
import { BehaviorSubject } from "rxjs";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { User } from "../gql-schemas/user.gql-schema";
import { EnableUserGQL } from "../enable-user-gql";
import { DisableUserGQL } from "../disable-user-gql";
import { map } from "rxjs/operators";

@Component({
  selector: "app-organization-detail-user-list",
  templateUrl: "./organization-detail-user-list.component.html",
  styleUrls: ["./organization-detail-user-list.component.scss"],
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", display: "none" })
      ),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
})
export class OrganizationDetailUserListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() data: User[];
  protected filterSubject: BehaviorSubject<string>;
  protected dataSource: OrganizationDetailUserListDataSource;
  protected displayedColumns = ["name"];
  protected displayedColumnHeaders = ["Name"];
  protected expandedRow: User;

  constructor(
    private enableUserGQL: EnableUserGQL,
    private disableUserGQL: DisableUserGQL
  ) {
    this.filterSubject = new BehaviorSubject("");
  }

  ngOnInit() {
    this.dataSource = new OrganizationDetailUserListDataSource(
      this.paginator,
      this.sort,
      this.data,
      this.filterSubject
    );
  }

  protected applyFilter(filterValue: string): void {
    this.filterSubject.next(filterValue);
  }

  private enableUser(userId: string): void {
    this.enableUserGQL
      .mutate({ userId: userId })
      .pipe(map(res => res.data))
      .subscribe(
        ({ enableUser }) =>
          (this.dataSource.data = this.dataSource.data.map(user => {
            if (user._id === enableUser._id) {
              user.active = enableUser.active;
            }

            return user;
          }))
      );
  }

  private disableUser(userId: string): void {
    this.disableUserGQL
      .mutate({ userId: userId })
      .pipe(map(res => res.data))
      .subscribe(
        ({ disableUser }) =>
          (this.dataSource.data = this.dataSource.data.map(user => {
            if (user._id === disableUser._id) {
              user.active = disableUser.active;
            }

            return user;
          }))
      );
  }
}
