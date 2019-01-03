import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog, MatSnackBar } from "@angular/material";
import { Observable, throwError } from "rxjs";
import { map, combineLatest, catchError } from "rxjs/operators";
import { UserGqlQuery } from "../../gql-queries/user-gql-query";
import { User } from "../../user.gql-schema";
import { DisableUserGqlMutation } from "../../gql-mutations/disable-user-gql-mutation";
import { UpdateUserGqlMutation } from "../../gql-mutations/update-user-gql-mutation";
import { EnableUserGqlMutation } from "../../gql-mutations/enable-user-gql-mutation";
import { ResetUserPasswordGqlMutation } from "../../gql-mutations/reset-user-password-gql-mutation";
import { DestroyConfirmationDialogComponent } from "src/app/shared/destroy-confirmation-dialog/destroy-confirmation-dialog.component";
import { DestroyUserGqlMutation } from "../../gql-mutations/destroy-user-gql-mutation";

@Component({
  selector: "app-user-detail",
  templateUrl: "./user-detail.component.html",
  styleUrls: ["./user-detail.component.scss"]
})
export class UserDetailComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private userGqlQuery: UserGqlQuery,
    private updateUserGqlMutation: UpdateUserGqlMutation,
    private enableUserGqlMutation: EnableUserGqlMutation,
    private disableUserGqlMutation: DisableUserGqlMutation,
    private resetUserPasswordGqlMutation: ResetUserPasswordGqlMutation,
    private destroyUserGqlMutation: DestroyUserGqlMutation,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.viewOnlyMode = false;
  }
  private userId: string;
  protected user$: Observable<User>;
  protected viewOnlyMode: boolean;

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get(`id`);

    this.user$ = this.userGqlQuery
      .watch({ userId: this.userId })
      .valueChanges.pipe(map(res => res.data.user));
  }

  protected editingData($event: boolean): void {
    // only set if there is a change
    if (this.viewOnlyMode === $event) {
      return;
    }

    this.viewOnlyMode = $event;
  }

  protected promptDestroy(name: string): void {
    this.dialog
      .open(DestroyConfirmationDialogComponent, {
        data: {
          text: `Are you sure you want to delete ${name}`
        }
      })
      .afterClosed()
      .subscribe(confirmed => {
        if (!confirmed) {
          return;
        }

        this.destroyUser();
      });
  }

  private destroyUser() {
    this.destroyUserGqlMutation
      .mutate({ userId: this.userId })
      .pipe(catchError(res => this.handleError(res)))
      .pipe(map(res => res.data.user))
      .subscribe(_ => {
        this.clearError();
        this.router.navigate(["/users"]);
      });
  }

  protected updateData(updatedField: any, fieldName: string): void {
    const variables = { userId: this.userId };
    variables[fieldName] = updatedField;

    this.updateUserGqlMutation
      .mutate(variables)
      .pipe(catchError(res => this.handleError(res)))
      .pipe(map(res => res.data.user))
      .subscribe();
  }

  protected enableUser() {
    this.enableUserGqlMutation
      .mutate({ userId: this.userId })
      .pipe(catchError(res => this.handleError(res)))
      .pipe(map(res => res.data.user))
      .subscribe();
  }

  protected disableUser() {
    this.disableUserGqlMutation
      .mutate({ userId: this.userId })
      .pipe(catchError(res => this.handleError(res)))
      .pipe(map(res => res.data.user))
      .subscribe();
  }

  protected resetPassword() {
    this.resetUserPasswordGqlMutation
      .mutate({ userId: this.userId })
      .pipe(catchError(res => this.handleError(res)))
      .pipe(map(res => res.data.user))
      .subscribe();
  }

  private handleError(res: any): Observable<any> {
    if (res.message) {
      this.displayError(res.message);
    }

    return throwError(res);
  }

  private displayError(errorMessage: string) {
    this.snackBar.open(errorMessage, `Dismiss`);
  }

  private clearError() {
    this.snackBar.dismiss();
  }
}
