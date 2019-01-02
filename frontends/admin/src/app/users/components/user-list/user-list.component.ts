import { Component, OnInit } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { map, combineLatest, filter } from "rxjs/operators";
import { UserListGqlQuery } from "../../user-list-gql-query";
import { User } from "../../user.gql-schema";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"]
})
export class UserListComponent implements OnInit {
  protected userList$: Observable<User[]>;
  private filterString: BehaviorSubject<string>;

  constructor(private userListGqlQuery: UserListGqlQuery) {
    this.filterString = new BehaviorSubject("");
  }

  ngOnInit() {
    this.userList$ = this.userListGqlQuery
      .watch()
      .valueChanges.pipe(map(res => res.data.userList))
      .pipe(
        combineLatest(this.filterString.asObservable(), (userList, filter) =>
          userList.filter(
            user =>
              // we show name and email, so only include results where the filter string is present in either one or the either
              user.name.toLocaleUpperCase().includes(filter) ||
              user.email.toLocaleUpperCase().includes(filter)
          )
        )
      );
  }

  applyFilter(filterString: string) {
    // need tp filter out nulls but doing !filter returns on empty string which is valid, so check typeof not string instead
    if (typeof filterString !== "string") {
      return;
    }

    this.filterString.next(filterString.toLocaleUpperCase());
  }
}
