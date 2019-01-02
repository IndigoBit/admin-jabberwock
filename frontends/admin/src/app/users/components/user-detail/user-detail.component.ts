import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Event } from "@angular/router";
import { Observable } from "rxjs";
import { map, merge, combineLatest } from "rxjs/operators";
import { UserGqlQuery } from "../../user-gql-query";
import { User } from "../../user.gql-schema";
import { UpdateUserGqlMutation } from "../../update-user-gql-mutation";
import { EnableUserGqlMutation } from "../../enable-user-gql-mutation";
import { DisableUserGqlMutation } from "../../disable-user-gql-mutation";
import { ResetUserPasswordGqlMutation } from "../../reset-user-password-gql-mutation.1";

@Component({
  selector: "app-user-detail",
  templateUrl: "./user-detail.component.html",
  styleUrls: ["./user-detail.component.scss"]
})
export class UserDetailComponent implements OnInit {
  private userId: string;
  protected user$: Observable<User>;
  protected viewOnlyMode: boolean;

  constructor(
    private userGqlQuery: UserGqlQuery,
    private updateUserGqlMutation: UpdateUserGqlMutation,
    private enableUserGqlMutation: EnableUserGqlMutation,
    private disableUserGqlMutation: DisableUserGqlMutation,
    private resetUserPasswordGqlMutation: ResetUserPasswordGqlMutation,
    private route: ActivatedRoute
  ) {
    this.viewOnlyMode = false;
  }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get(`id`);

    this.user$ = this.userGqlQuery
      .watch({ userId: this.userId })
      .valueChanges.pipe(map(res => res.data.user));
  }

  protected deleteCard(): void {
    //todo, prompt, on confirm delete
    console.log(`todo`);
  }

  protected updateData(updatedField: any, fieldName: string): void {
    const variables = { userId: this.userId };
    variables[fieldName] = updatedField;

    const updatedUser$ = this.updateUserGqlMutation
      .mutate(variables)
      .pipe(map(res => res.data.updateUser));

    this.overrideWithUpdatedUser(updatedUser$);
  }

  protected editingData($event: boolean): void {
    // only set if there is a change
    if (this.viewOnlyMode === $event) {
      return;
    }

    this.viewOnlyMode = $event;
  }

  protected enableUser() {
    const updatedUser$ = this.enableUserGqlMutation
      .mutate({ userId: this.userId })
      .pipe(map(res => res.data.user));

    this.overrideWithUpdatedUser(updatedUser$);
  }

  protected disableUser() {
    const updatedUser$ = this.disableUserGqlMutation
      .mutate({ userId: this.userId })
      .pipe(map(res => res.data.user));

    this.overrideWithUpdatedUser(updatedUser$);
  }

  protected resetPassword() {
    const updatedUser$ = this.resetUserPasswordGqlMutation
      .mutate({ userId: this.userId })
      .pipe(map(res => res.data.user));

    this.overrideWithUpdatedUser(updatedUser$);
  }

  protected overrideWithUpdatedUser(updatedUser$: Observable<User>): void {
    this.user$ = this.user$.pipe(
      combineLatest(updatedUser$, (s1, s2) => Object.assign({}, s1, s2))
    );
  }
}
